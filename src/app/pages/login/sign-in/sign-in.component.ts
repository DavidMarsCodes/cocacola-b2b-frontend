import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrService } from 'ngx-toastr';
import { LoginServicesEnum } from 'src/app/core/enums/login-services.enum';
import { LoginSteps } from 'src/app/core/enums/login-steps.enum';
import { CognitoErrorResp } from 'src/app/core/models/backend/cognito-error-resp';
import { LoginInputTypes, LoginStep } from 'src/app/core/models/login-step.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { UserService } from 'src/app/core/services/user.service';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import { RegexList } from 'src/app/core/utils/regex-list.regex';
import { LoginStepsService } from '../services/login-steps.service';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  countryCode: CountryCodes;

  loginSteps: LoginStep[];
  currentStep: LoginStep;
  stepIndex = 0;
  showPassword = false;

  phonesCodes: string[];
  phoneCodeSelected: string;
  loginUserInfo: any;
  loginForm: FormGroup;
  readonly LoginSteps = LoginSteps;
  readonly LoginInputTypes = LoginInputTypes;
  readonly LoginServicesEnum = LoginServicesEnum;
  readonly ROOT_LANG = 'LOGIN.SIGN_IN.';

  serviceError = false;
  serviceErrorMsg: string;
  restoreCode: string;
  confirmCode: string;

  constructor(
    private userService: UserService,
    private loginStepsSrv: LoginStepsService,
    private router: Router,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private cognitoService: CognitoService,
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
    private gtmService: GoogleTagManagerService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(RegexList.emailRegex)]),
      restoreEmail: new FormControl('', [Validators.required, Validators.pattern(RegexList.emailRegex)]),
      phone: new FormControl('', [Validators.required]),
      restorePhone: new FormControl('', [Validators.required]),
      // rememberPwd: new FormControl(false),
      password: new FormControl('', [Validators.required, Validators.pattern(RegexList.password)]),
    });
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.translateService.use(this.countryCode).subscribe(() => {
      this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.PASSWORD);
      this.phonesCodes = this.translateService.instant(this.ROOT_LANG + 'USER_PHONE.CODES')?.split(',');
      this.phoneCodeSelected = this.phonesCodes[0];
    });

    this.loginForm.valueChanges.subscribe((e) => (this.serviceError = false));

    this.requestCredential();
  }

  returnHomeLogin(): void {
    this.router.navigate(['/']);
  }

  actionStep(button): void {
    if (!this.isTheStepValid(button)) return;
    this.loginUserInfo = {
      ...this.loginForm.value,
      firstName: this.loginUserInfo?.firstName,
      phone: this.phoneCodeSelected + this.loginForm.get('phone').value,
      restorePhone: this.phoneCodeSelected + this.loginForm.get('restorePhone').value,
    };
    if (button.actionType === 'STEP') {
      this.resetForm();
      this.currentStep = this.loginStepsSrv.getSignInStep(button.action, this.currentStep.stepName, this.loginUserInfo);
    } else {
      this.handleSignInServices(button);
    }
  }

  handleSignInServices(button): void {
    switch (button.action) {
      case LoginServicesEnum.LOGIN:
        // const userName = this.currentStep.previousStep === LoginSteps.EMAIL ? this.loginUserInfo.email : this.loginUserInfo.phone;
        this.loginAws(this.loginUserInfo.email, this.loginUserInfo.password, 'login');
        break;
      case LoginServicesEnum.RESEND_CONFIRM_CODE:
        this.cognitoService.resendSignUp(this.loginUserInfo.email).subscribe(
          (res) => this.toastr.success('Se envió un nuevo código a tu email'),
          (error) => this.toastr.error('Ocurrió un error al enviar el código. Por favor envíelo nuevamente.')
        );
        break;
      case LoginServicesEnum.CONFIRM_USER:
        this.confirmSignUp(this.loginUserInfo.email, this.confirmCode);
        break;
      case LoginServicesEnum.SEND_EMAIL:
      case LoginServicesEnum.RESEND_EMAIL_CODE:
        this.forgotPasswordAws(button);
        break;
      // case LoginServicesEnum.SEND_SMS:
      //   this.cognitoService.forgotPassword(this.loginUserInfo.phone).subscribe(
      //     (res) => {
      //       this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.RESTORE_PHONE_CONFIRM, LoginServicesEnum.SEND_SMS, this.loginUserInfo);
      //     },
      //     (error) => this.handleError(error)
      //   );
      //   break;
      // case LoginServicesEnum.SEND_WHATSAPP:
      //   this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.RESTORE_PHONE_CONFIRM, LoginServicesEnum.SEND_WHATSAPP, this.loginUserInfo);
      //   break;
      case LoginServicesEnum.RESTORE_PWD:
        this.forgotPasswordConfirmAws();
        break;
      case LoginServicesEnum.RETURN_HOME:
        this.router.navigate(['/']);
        break;
      default:
        break;
    }
  }

  private loginAws(userName, password, event): void {
    this.cognitoService.signInAws(userName, password).subscribe(
      (cognitoUser) => {
        this.saveCredentialsInBrowser(userName, password);
        const jwt = cognitoUser.signInUserSession.idToken.jwtToken;
        this.store.dispatch(UserActions.loadJwt({ jwt }));
        const userNameCognito = cognitoUser.username;
        this.userService.getUserInfo(userNameCognito).subscribe(
          (res) => {
            this.store.dispatch(UserActions.loadUser({ user: res.data }));
            this.store.dispatch(ClientActions.updateClient({ client: res.data?.clients[0] }));
            this.pushLoginEvent(event, res);
            this.userService.initClientSession().subscribe();
            this.router.navigate(['/main/home']);
          },
          (error) => this.handleError(error)
        );
      },
      (error: CognitoErrorResp) => {
        if (error.code === 'UserNotConfirmedException') {
          this.goToConfirmUserStep();
          return;
        }
        this.handleError(error);
      }
    );
  }

  private pushLoginEvent(event, res): void {
    this.gtmService.pushTag({
      event,
      user: { ...res.data, jwt: '', clients: [] },
      client: res.data?.clients[0],
    });
  }

  goToConfirmUserStep(): void {
    this.cognitoService.resendSignUp(this.loginUserInfo.email).subscribe(
      (res) => {
        this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.CONFIRM_CODE, this.currentStep.stepName, this.loginUserInfo);
      },
      (error) => {
        this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.CONFIRM_CODE, this.currentStep.stepName, this.loginUserInfo);
        this.toastr.error('Ocurrió un error al enviar el código. Por favor envíelo nuevamente.');
      }
    );
  }

  confirmSignUp(userName, confirmCode): void {
    this.cognitoService.confirmSignUpAws(userName, confirmCode).subscribe(
      (res) => {
        this.toastr.success('Usuario confirmado con éxito');
        setTimeout(() => this.toastr.success('Accediendo a la home'), 1000);
        this.loginAws(userName, this.loginUserInfo.password, 'confirmUser');
      },
      (error) => this.handleError(error)
    );
  }

  private forgotPasswordAws(button): void {
    this.cognitoService.forgotPassword(this.loginUserInfo.restoreEmail).subscribe(
      (res) => {
        if (button.action === LoginServicesEnum.SEND_EMAIL) {
          this.currentStep = this.loginStepsSrv.getSignInStep(LoginSteps.RESTORE_EMAIL_CODE, '', this.loginUserInfo);
        }
        if (button.action === LoginServicesEnum.RESEND_EMAIL_CODE) {
          this.toastr.success('Se envió un nuevo código a tu email');
        }
      },
      (error) => {
        this.serviceError = true;
        switch (error.code) {
          case 'InvalidParameterException':
            this.serviceErrorMsg = this.translateService.instant('ERRORS.InvalidParameterException_SendCode');
            break;
          case 'UserNotFoundException':
            this.serviceErrorMsg = this.translateService.instant('ERRORS.UserNotFoundException_SendCode');
            break;
          default:
            this.handleError(error);
            break;
        }
      }
    );
  }

  private forgotPasswordConfirmAws(): void {
    this.userService.changeUserPassword(this.loginUserInfo.restoreEmail, this.restoreCode, this.loginUserInfo.password, false).subscribe(
      (res) => {
        this.toastr.success('Se restauró la contraseña con éxito');
        this.loginAws(this.loginUserInfo.restoreEmail, this.loginUserInfo.password, 'recoverPassword');
      },
      (error) => {
        if (error?.code == 2100) {
          this.handleError({ code: error.errorType });
        } else {
          this.serviceError = true;
          this.serviceErrorMsg = this.translateService.instant('ERRORS.UPDATE_USER_PWD');
        }
      }
    );
  }

  // navigator credencials functions
  private saveCredentialsInBrowser(username, password): any {
    // @ts-ignore
    if (!window.PasswordCredential) {
      return false;
    }
    // @ts-ignore
    const cred = new window.PasswordCredential({
      id: username,
      password: password,
      name: username,
    });
    navigator.credentials.store(cred).catch((err) => console.log('Error storing credentials: ' + err));
  }

  private requestCredential(): void {
    if (!navigator.credentials) {
      console.error('Credential Management API not supported');
      return;
    }
    navigator.credentials
      // @ts-ignore
      .get({ password: true })
      .then((credential: any) => {
        if (credential) {
          this.loginAws(credential.id, credential.password, 'login');
        }
      })
      .catch((err) => console.error('Error reading credentials: ' + err));
  }

  isMobile(): boolean {
    return screen.width < 576;
  }

  goStepBack(): void {
    if (this.currentStep.previousStep) {
      this.resetForm();
      this.resetCustomFields();
      this.currentStep = this.loginStepsSrv.getSignInStep(this.currentStep.previousStep, '', this.loginUserInfo);
    } else {
      this.router.navigate(['/']);
    }
  }

  isTheStepValid(button): boolean {
    if (!button.needsValidation) {
      return true;
    }
    switch (this.currentStep.inputType) {
      case LoginInputTypes.CODE:
        return this.restoreCode?.length === 6 || this.confirmCode?.length === 6;
      case LoginInputTypes.PASSWORD:
        if (this.currentStep.stepName === LoginInputTypes.PASSWORD) {
          return this.loginForm.get(LoginInputTypes.PASSWORD).valid && this.loginForm.get(LoginInputTypes.EMAIL).valid;
        }
        return this.loginForm.get(LoginInputTypes.PASSWORD).valid;
      default:
        return this.loginForm.get(this.currentStep.stepName).valid;
    }
  }

  private handleError(error: CognitoErrorResp | any): void {
    this.translateService.get('ERRORS.' + error.code).subscribe((errorText: string) => {
      this.serviceError = true;
      if (errorText.startsWith('ERRORS.')) {
        this.serviceErrorMsg = this.translateService.instant('ERRORS.UNKNOWN_ERROR');
      } else {
        this.serviceErrorMsg = errorText;
      }
    });
  }

  private resetForm(): void {
    this.loginForm.markAsUntouched();
    this.serviceError = false;
    this.showPassword = false;
    this.loginForm.get('password').reset();
  }

  private resetCustomFields(): void {
    switch (this.currentStep.previousStep) {
      case LoginSteps.CHOOSE_USER:
        this.loginForm.get('email').reset();
        this.loginForm.get('phone').reset();
        break;
      case LoginSteps.RESTORE_CHOOSE:
        this.loginForm.get('restoreEmail').reset();
        this.loginForm.get('restorePhone').reset();
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
