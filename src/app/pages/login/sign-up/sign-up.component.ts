import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginStep } from 'src/app/core/models/login-step.model';
import { LoginStepsService } from '../services/login-steps.service';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { LoginSteps } from 'src/app/core/enums/login-steps.enum';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegexList } from 'src/app/core/utils/regex-list.regex';
import { LoginUser } from 'src/app/core/models/login-user.model';
import { UserService } from 'src/app/core/services/user.service';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { CognitoErrorResp } from 'src/app/core/models/backend/cognito-error-resp';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/core/state/actions/user.actions';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { TycModalComponent } from '../components/tyc-modal/tyc-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from 'src/app/core/constants/constants';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  countryCode: CountryCodes;
  countrySelected: any;

  readonly LoginSteps = LoginSteps;
  readonly CountryCodes = CountryCodes;
  readonly ROOT_LANG = 'LOGIN.SIGN_UP.';

  loginSteps: LoginStep[];
  currentStep: LoginStep;
  stepIndex = 0;
  showPassword = false;

  phonesCodes: string[];
  phoneCodeSelected: string;

  loginUser: LoginUser;
  loginForm: FormGroup;
  serviceError = false;
  serviceErrorMsg: string;
  confirmCode: string;

  signUpWithEmail = true;
  userLocal: UserLocal;

  constructor(
    private loginStepsService: LoginStepsService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService,
    private cognitoService: CognitoService,
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
    private gtmService: GoogleTagManagerService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
  }

  // tslint:disable-next-line: typedef
  async ngOnInit() {
    await this.translateService.use(this.userLocal.geoCountryCode).toPromise();
    this.countrySelected = Constants.countries.find((country) => country.key === this.userLocal.geoCountryCode);
    this.loadRegisterForm();
    this.loginSteps = this.loginStepsService.loginNotPasswordSteps();
    this.currentStep = this.loginSteps[this.stepIndex];
    this.phonesCodes = this.translateService.instant(this.ROOT_LANG + 'PHONE.CODES')?.split(',');
    this.phoneCodeSelected = this.phonesCodes[0];
  }

  loadRegisterForm(): void {
    this.loginForm = new FormGroup({
      legals: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(RegexList.nameRegex), this.noWhitespaceValidator]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(RegexList.nameRegex), this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, Validators.pattern(RegexList.emailRegex)]),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.countrySelected.phoneRegex)]),
      rutNumber: new FormControl('', [Validators.required, this.fiscalIdValidator(this.countrySelected.fiscalIdRegex)]),
      clientNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(RegexList.password)]),
      // confirmCode: new FormControl('', [Validators.required]),
    });
    this.loginForm.valueChanges.subscribe((e) => (this.serviceError = false));
  }

  nextStep(): void {
    if (!this.isTheStepValid()) return;
    this.loginUser = this.loginForm.value;
    this.loginUser.phone = this.phoneCodeSelected + this.loginForm.get('phone').value;

    if (this.currentStep.stepName === LoginSteps.PASSWORD) {
      this.signUp();
    } else if (this.currentStep.stepName === LoginSteps.CONFIRM_CODE) {
      const userName = this.signUpWithEmail ? this.loginUser.email : this.loginUser.phone;
      this.confirmSignUp(userName, this.confirmCode);
    } else {
      this.stepIndex++;
      this.currentStep = this.loginSteps[this.stepIndex];
    }
  }

  signUp(): void {
    this.userService.setNewUser(this.loginUser).subscribe(
      (res) => {
        this.stepIndex++;
        this.loginSteps = this.loginStepsService.loginNotPasswordSteps(this.loginUser.email);
        this.currentStep = this.loginSteps[this.stepIndex];
      },
      (error) => this.handleError(error)
    );
  }

  confirmSignUp(userName, confirmCode): void {
    this.cognitoService.confirmSignUpAws(userName, confirmCode).subscribe(
      (res) => {
        this.signInAfterSignUp(this.loginUser.email, this.loginUser.password);
      },
      (error) => this.handleError(error)
    );
  }

  resendSignUp(): void {
    this.cognitoService.resendSignUp(this.loginUser.email).subscribe(
      (res) => {
        this.serviceError = false;
        this.toastr.success('Se envió un nuevo código a tu email');
      },
      (error) => this.handleError(error)
    );
  }

  private signInAfterSignUp(userName, password): void {
    this.cognitoService.signInAws(userName, password).subscribe(
      (cognitoUser) => {
        this.saveCredentialsInBrowser(userName, password);
        const jwt = cognitoUser.signInUserSession.idToken.jwtToken;
        this.store.dispatch(UserActions.loadJwt({ jwt }));
        const userNameCognito = cognitoUser.username;
        this.userService.getUserInfo(userNameCognito).subscribe((res) => {
          this.store.dispatch(UserActions.loadUser({ user: res.data }));
          this.store.dispatch(ClientActions.updateClient({ client: res.data?.clients[0] }));
          this.pushLogingEvent(res);
          this.userService.initClientSession().subscribe();
          this.router.navigate(['/main/home']);
        });
      },
      (error: CognitoErrorResp) => this.handleError(error)
    );
  }

  private pushLogingEvent(res): void {
    this.gtmService.pushTag({
      event: 'sign-up',
      user: { ...res.data, jwt: '', clients: [] },
      client: res.data?.clients[0],
    });
  }

  isTheStepValid(): boolean {
    if (this.currentStep.stepName === LoginSteps.CONFIRM_CODE) {
      return this.confirmCode?.length === 6;
    } else {
      return this.loginForm.get(this.currentStep.stepName)?.valid && this.loginForm.get(LoginSteps.LEGALS).value;
    }
  }

  goStepBack(): void {
    this.resetForm();
    if (this.stepIndex != 0) {
      this.stepIndex--;
      this.currentStep = this.loginSteps[this.stepIndex];
    } else {
      this.router.navigate(['/']);
    }
  }

  splittedInputUpdated(code): any {
    this.confirmCode = code;
  }

  private handleError(error): void {
    this.translateService.get('ERRORS.' + error.code).subscribe((errorText: string) => {
      this.serviceError = true;
      if (errorText.startsWith('ERRORS.')) {
        this.serviceErrorMsg = this.translateService.instant('ERRORS.UNKNOWN_ERROR');
      } else {
        this.serviceErrorMsg = errorText;
      }
    });
  }

  saveCredentialsInBrowser(username, password): any {
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
    navigator.credentials.store(cred).catch((err) => console.error('Error storing credentials: ' + err));
  }

  ////// Validators /////
  fiscalIdValidator(fiscalIdRegex: RegExp[] | string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (fiscalIdRegex === 'RUT') {
        return this.rutChileValidator(control.value) ? null : { fiscalIdPattern: { value: control.value } };
      } else {
        const isValid = (fiscalIdRegex as RegExp[]).some((regex) => regex.test(control.value));
        return isValid ? null : { fiscalIdPattern: { value: control.value } };
      }
    };
  }

  private resetForm(): void {
    this.loginForm.markAsUntouched();
    this.serviceError = false;
    this.showPassword = false;
    // this.loginForm.get('password').reset();
  }

  private rutChileValidator(rutCompleto): boolean {
    // Valida el rut con su cadena completa "XXXXXXXX-X"
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    var tmp = rutCompleto.split('-');
    var digv = tmp[1];
    var rut = tmp[0];
    if (rut.length < 7 || rut.length > 8) return false;
    if (digv == 'K') digv = 'k';
    return this.dv(rut) == digv;
  }

  dv(T): any {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : 'k';
  }

  private noWhitespaceValidator(control: FormControl): any {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  trimValue(event): void {
    event.target.value = event.target.value.trim();
  }

  onPhoneInput(): void {
    const phoneValue = this.loginForm.get('phone').value + '';
    this.countrySelected.key === 'CL'
      ? this.loginForm.patchValue({
          phone: phoneValue.length > 9 ? phoneValue.slice(0, 9) : phoneValue.replace(/[^0-9]/g, ''),
        })
      : this.loginForm.patchValue({
          phone: phoneValue.length > 11 ? phoneValue.slice(0, 11) : phoneValue.replace(/[^0-9]/g, ''),
        });
  }

  onCuitInput(): void {
    const rutNumberValue = this.loginForm.get('rutNumber').value + '';
    if (this.countrySelected.key === 'AR') {
      this.loginForm.patchValue({
        rutNumber: rutNumberValue.replace(/[^0-9]/g, ''),
      });
    }
  }

  openTyCModal(): void {
    const modalTyc = this.modalService.open(TycModalComponent, { windowClass: 'ngbmodal-centered', size: 'xl' });
    modalTyc.result.then(
      (confirm) => this.loginForm.get('legals').setValue(confirm),
      (rejected) => {}
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
