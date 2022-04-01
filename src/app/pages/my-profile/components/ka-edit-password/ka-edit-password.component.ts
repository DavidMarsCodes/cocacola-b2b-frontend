import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { UserService } from 'src/app/core/services/user.service';
import { RegexList } from 'src/app/core/utils/regex-list.regex';
import { AbstractViewInit } from 'src/app/core/classes/abstract-view-init';
import { ValidationUtils } from 'src/app/core/utils/validation-utils';

@Component({
  selector: 'app-ka-edit-password',
  templateUrl: './ka-edit-password.component.html',
  styleUrls: ['./ka-edit-password.component.scss'],
})
export class KaEditPasswordComponent extends AbstractViewInit implements OnInit, OnDestroy {
  user: UserInfo;
  showInputs = false;
  recoveryForm: FormGroup;
  private subscriptions = new Subscription();

  readonly LANG_ROOT = 'MY_PROFILE.CHANGE_PWD_COMP.';
  readonly LANG_ROOT_FORM = 'MY_PROFILE.CHANGE_PWD_COMP.FORM.';
  readonly LANG_ROOT_MATCH_PWD = 'MY_PROFILE.CHANGE_PWD_COMP.FORM.MATCHING_PWD.';

  constructor(
    private store: Store<{ user: UserInfo }>,
    private cognitoService: CognitoService,
    private userService: UserService,
    private toastrService: ToastrService,
    private gtmService: GoogleTagManagerService
  ) {
    super();
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.recoveryForm = new FormGroup({
      recoveryCode: new FormControl('', [Validators.required, Validators.pattern(RegexList.numberRegex), Validators.minLength(6)]),
      matchingPasswords: new FormGroup(
        {
          pwd: new FormControl('', [Validators.required, Validators.pattern(RegexList.password)]),
          confirmPwd: new FormControl('', Validators.required),
        },
        this.matchValidator
      ),
    });
  }

  ngOnInit(): void {}

  sendRecoverCode(): void {
    this.cognitoService.forgotPassword(this.user.email).subscribe(
      (res) => (this.showInputs = true),
      (error) => this.toastrService.error('Ocurrió un error al enviar el código. Por favor intente nuevamente.')
    );
  }

  confirmNewPass(): any {
    if (!this.recoveryForm.valid) return;
    const formValues = this.recoveryForm.value;
    this.userService.changeUserPassword(this.user.email, formValues.recoveryCode + '', formValues.matchingPasswords.pwd, true).subscribe((res) => {
      this.gtmService.pushTag({ event: 'changePassword' });
      this.toastrService.success('Se cambió la contraseña con éxito');
      this.recoveryForm.reset();
      this.showInputs = false;
    });
  }

  matchValidator(group: FormGroup): any {
    let valid = false;
    const pwd = group.controls.pwd;
    const confirmPwd = group.controls.confirmPwd;
    if (!pwd.value) return null;
    valid = pwd.value === confirmPwd.value;
    return valid ? null : { mismatch: true };
  }

  onKeyDownCode(event): void {
    if (event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || ValidationUtils.isPasteEvent(event)) return;
    const numberRegex = /^[0-9]$/;
    if (!numberRegex.test(event.key)) event.preventDefault();
  }

  // codeLengthValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const isValid = control.value > 99999 && control.value < 1000000;
  //     return isValid ? null : { codeLength: true };
  //   };
  // }

  trimValue(event): void {
    event.target.value = event.target.value.trim();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
