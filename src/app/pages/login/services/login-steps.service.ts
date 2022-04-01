import { Injectable } from '@angular/core';
import { LoginSteps } from 'src/app/core/enums/login-steps.enum';
import { LoginServicesEnum } from '../../../core/enums/login-services.enum';
import { TranslateService } from '@ngx-translate/core';
import { LoginUser } from 'src/app/core/models/login-user.model';
import * as _ from 'lodash';
import { LoginInputTypes, LoginStep } from 'src/app/core/models/login-step.model';

@Injectable({
  providedIn: 'root',
})
export class LoginStepsService {
  constructor(private translateSrv: TranslateService) {}

  getSignInStep(stepName: string, previousStep?: string, loginUser?: LoginUser): any {
    return this.signInSteps(previousStep, loginUser).find((step) => stepName === step.stepName);
  }

  private signInSteps(previousStep?: string, loginUser?: LoginUser): LoginStep[] {
    const ROOT_LANG = 'LOGIN.SIGN_IN.';
    return [
      // {
      //   stepName: LoginSteps.CHOOSE_USER,
      //   stepNumber: 1,
      //   title: this.translateSrv.instant(ROOT_LANG + 'CHOOSE_USER.TITLE'),
      //   bodyButtons: [
      //     {
      //       id: 'con-mi-correo',
      //       label: this.translateSrv.instant(ROOT_LANG + 'CHOOSE_USER.EMAIL_BUTTON'),
      //       style: 'button-red-border',
      //       action: LoginSteps.EMAIL,
      //       actionType: 'STEP',
      //     },
      //     {
      //       id: 'con-mi-tel',
      //       label: this.translateSrv.instant(ROOT_LANG + 'CHOOSE_USER.PHONE_BUTTON'),
      //       style: 'button-red-border',
      //       action: LoginSteps.PHONE,
      //       actionType: 'STEP',
      //     },
      //   ],
      // },
      // {
      //   stepName: LoginSteps.EMAIL,
      //   // previousStep: LoginSteps.CHOOSE_USER,
      //   inputType: LoginInputTypes.EMAIL,
      //   stepNumber: 2,
      //   title: this.translateSrv.instant(ROOT_LANG + 'USER_EMAIL.TITLE'),
      //   footerButtons: [
      //     {
      //       id: 'continuar-login-correo',
      //       label: this.translateSrv.instant(ROOT_LANG + 'USER_EMAIL.BUTTON'),
      //       style: 'button-red-border',
      //       action: LoginServicesEnum.GET_USER_BY_EMAIL,
      //       actionType: 'SERVICE',
      //       needsValidation: true,
      //     },
      //   ],
      // },
      // {
      //   stepName: LoginSteps.PHONE,
      //   previousStep: LoginSteps.CHOOSE_USER,
      //   inputType: LoginInputTypes.PHONE,
      //   stepNumber: 2,
      //   title: this.translateSrv.instant(ROOT_LANG + 'USER_PHONE.TITLE'),
      //   footerButtons: [
      //     {
      //       id: 'continuar-login-tel',
      //       label: this.translateSrv.instant(ROOT_LANG + 'USER_PHONE.BUTTON'),
      //       style: 'button-red-border',
      //       action: LoginServicesEnum.GET_USER_BY_PHONE,
      //       actionType: 'SERVICE',
      //       needsValidation: true,
      //     },
      //   ],
      // },
      {
        stepName: LoginSteps.PASSWORD,
        //previousStep: previousStep || LoginSteps.EMAIL,
        inputType: LoginInputTypes.PASSWORD,
        stepNumber: 3,
        title: this.translateSrv.instant(ROOT_LANG + 'ENTER_PWD.TITLE'),
        // subtitle: this.translateSrv.instant(`${ROOT_LANG}ENTER_PWD.${previousStep === LoginSteps.PHONE ? 'SUBTITLE_PHONE' : 'SUBTITLE_EMAIL'}`, {
        //   loginUser,
        // }),
        footerButtons: [
          {
            id: 'ingresar-a-mi-cuenta-login-' + (previousStep === LoginSteps.PHONE ? 'tel' : 'correo'),
            label: this.translateSrv.instant(ROOT_LANG + 'ENTER_PWD.ENTER'),
            style: 'button-red-border',
            action: LoginServicesEnum.LOGIN,
            actionType: 'SERVICE',
            needsValidation: true,
          },
          // {
          //   id: 'olvide-contraseña-' + (previousStep === LoginSteps.PHONE ? 'tel' : 'mail'),
          //   label: this.translateSrv.instant(ROOT_LANG + 'ENTER_PWD.FORGOT_PWD'),
          //   style: 'blue-link',
          //   // action: LoginSteps.RESTORE_CHOOSE,
          //   action: LoginSteps.RESTORE_EMAIL,
          //   actionType: 'STEP',
          // },
          // {
          //   id: 'usar-otro-' + (previousStep === LoginSteps.PHONE ? 'tel' : 'correo'),
          //   label: this.translateSrv.instant(`${ROOT_LANG}ENTER_PWD.${previousStep === LoginSteps.PHONE ? 'USE_ANOTHER_PHONE' : 'USE_ANOTHER_EMAIL'}`),
          //   style: 'blue-link',
          //   action: previousStep || LoginSteps.EMAIL,
          //   actionType: 'STEP',
          // },
        ],
      },
      // {
      //   stepName: LoginSteps.RESTORE_CHOOSE,
      //   previousStep: LoginSteps.PASSWORD,
      //   stepNumber: 1,
      //   title: this.translateSrv.instant(ROOT_LANG + 'RESTORE_PWD_CHOOSE.TITLE'),
      //   bodyButtons: [
      //     {
      //       id: 'olvide-contraseña-mail-recup-corrreo',
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_PWD_CHOOSE.RESTORE_WITH_EMAIL'),
      //       style: 'button-red-border',
      //       action: LoginSteps.RESTORE_EMAIL,
      //       actionType: 'STEP',
      //     },
      //     {
      //       id: 'olvide-contraseña-mail-recup-tel',
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_PWD_CHOOSE.RESTORE_WITH_PHONE'),
      //       style: 'button-red-border',
      //       action: LoginSteps.RESTORE_PHONE,
      //       actionType: 'STEP',
      //     },
      //   ],
      //   footerButtons: [
      //     {
      //       id: 'ya-recorde-contraseña',
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_PWD_CHOOSE.FOOTER'),
      //       style: 'blue-link',
      //       action: LoginSteps.PASSWORD,
      //       actionType: 'STEP',
      //     },
      //   ],
      // },
      {
        stepName: LoginSteps.CONFIRM_CODE,
        previousStep: LoginSteps.PASSWORD,
        inputType: LoginInputTypes.CODE,
        stepNumber: 2,
        title: this.translateSrv.instant(ROOT_LANG + 'CONFIRM_CODE.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'CONFIRM_CODE.SUBTITLE', { loginUser }),
        footerButtons: [
          {
            id: 'resend-confirm-code',
            label: this.translateSrv.instant(ROOT_LANG + 'CONFIRM_CODE.LINK_RESEND'),
            style: 'blue-link',
            action: LoginServicesEnum.RESEND_CONFIRM_CODE,
            actionType: 'SERVICE',
            needsValidation: false,
          },
          {
            id: 'confirm-user-and-login',
            label: this.translateSrv.instant(ROOT_LANG + 'CONFIRM_CODE.BUTTON_CONFIRM'),
            style: 'button-red-border',
            action: LoginServicesEnum.CONFIRM_USER,
            actionType: 'SERVICE',
            needsValidation: true,
          },
        ],
      },
      {
        stepName: LoginSteps.RESTORE_EMAIL,
        // previousStep: LoginSteps.RESTORE_CHOOSE,
        previousStep: LoginSteps.PASSWORD,
        inputType: LoginInputTypes.EMAIL,
        stepNumber: 2,
        title: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL.TITLE'),
        footerButtons: [
          {
            id: 'enviar-codigo-recuperacion',
            label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL.RESTORE_BUTTON'),
            // label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL.RESTORE_BUTTON'),
            style: 'button-red-border',
            action: LoginServicesEnum.SEND_EMAIL,
            actionType: 'SERVICE',
            needsValidation: true,
          },
        ],
      },
      // {
      //   stepName: LoginSteps.RESTORE_PHONE,
      //   previousStep: LoginSteps.RESTORE_CHOOSE,
      //   inputType: LoginInputTypes.PHONE,
      //   stepNumber: 2,
      //   title: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE.TITLE'),
      //   footerButtons: [
      //     {
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE.RESTORE_WITH_SMS'),
      //       action: LoginServicesEnum.SEND_SMS,
      //       style: 'button-red-border',
      //       actionType: 'SERVICE',
      //       needsValidation: true,
      //     },
      //     {
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE.RESTORE_WITH_WHATSAPP'),
      //       style: 'button-red-border',
      //       action: LoginServicesEnum.SEND_WHATSAPP,
      //       actionType: 'SERVICE',
      //       needsValidation: true,
      //     },
      //   ],
      // },
      {
        stepName: LoginSteps.RESTORE_EMAIL_CODE,
        previousStep: LoginSteps.RESTORE_EMAIL,
        inputType: LoginInputTypes.CODE,
        stepNumber: 3,
        title: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL_CODE.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL_CODE.SUBTITLE', { loginUser }),
        footerButtons: [
          {
            id: 'volver-a-enviar',
            label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL_CODE.RESEND'),
            style: 'blue-link',
            action: LoginServicesEnum.RESEND_EMAIL_CODE,
            actionType: 'SERVICE',
          },
          {
            id: 'restaurar-contraseña',
            label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_EMAIL_CODE.RESTORE'),
            style: 'button-red-border',
            action: LoginSteps.RESTORE_EMAIL_PWD,
            actionType: 'STEP',
            needsValidation: true,
          },
        ],
      },
      {
        stepName: LoginSteps.RESTORE_EMAIL_PWD,
        previousStep: LoginSteps.RESTORE_EMAIL_CODE,
        inputType: LoginInputTypes.PASSWORD,
        stepNumber: 3,
        title: 'Ingresa tu nueva contraseña',
        subtitle: 'Debe tener al menos 8 caracteres alfanumérico.',
        footerButtons: [
          {
            id: 'restaurar-ingresar',
            label: 'Ingresar',
            style: 'button-red-border',
            action: LoginServicesEnum.RESTORE_PWD,
            actionType: 'SERVICE',
            needsValidation: true,
          },
        ],
      },
      // {
      //   stepName: LoginSteps.RESTORE_PHONE_CONFIRM,
      //   previousStep: LoginSteps.RESTORE_PHONE,
      //   inputType: LoginInputTypes.CODE,
      //   stepNumber: 3,
      //   title: this.translateSrv.instant(
      //     `${ROOT_LANG}RESTORE_WITH_PHONE_CONFIRM.${previousStep === LoginServicesEnum.SEND_SMS ? 'TITLE_SMS' : 'TITLE_WHATSAPP'}`
      //   ),
      //   subtitle: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE_CONFIRM.SUBTITLE', { loginUser }),
      //   footerButtons: [
      //     {
      //       label: this.translateSrv.instant(
      //         `${ROOT_LANG}RESTORE_WITH_PHONE_CONFIRM.${previousStep === LoginServicesEnum.SEND_SMS ? 'RESEND_SMS' : 'RESEND_WHATSAPP'}`
      //       ),
      //       style: 'blue-link',
      //       action: previousStep,
      //       actionType: 'SERVICE',
      //     },
      //     {
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE_CONFIRM.USE_ANOTHER_PHONE'),
      //       style: 'blue-link',
      //       action: LoginSteps.RESTORE_PHONE,
      //       actionType: 'STEP',
      //     },
      //     {
      //       label: this.translateSrv.instant(ROOT_LANG + 'RESTORE_WITH_PHONE_CONFIRM.RESTORE_BUTTON'),
      //       style: 'button-red-border',
      //       action: LoginServicesEnum.RESTORE_PWD,
      //       actionType: 'SERVICE',
      //     },
      //   ],
      // },
    ];
  }

  loginNotPasswordSteps(email?: string): any[] {
    const ROOT_LANG = 'LOGIN.SIGN_UP.';
    return [
      {
        stepName: LoginSteps.LEGALS,
        title: this.translateSrv.instant(ROOT_LANG + 'LEGALS.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.FIRST_NAME,
        title: this.translateSrv.instant(ROOT_LANG + 'FIRST_NAME.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.LAST_NAME,
        title: this.translateSrv.instant(ROOT_LANG + 'LAST_NAME.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.EMAIL,
        title: this.translateSrv.instant(ROOT_LANG + 'EMAIL.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.PHONE,
        title: this.translateSrv.instant(ROOT_LANG + 'PHONE.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.RUT_NUMBER,
        title: this.translateSrv.instant(ROOT_LANG + 'ID.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'ID.SUBTITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.CLIENT_NUMBER,
        title: this.translateSrv.instant(ROOT_LANG + 'CLIENT_NUMBER.TITLE'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.PASSWORD,
        title: this.translateSrv.instant(ROOT_LANG + 'PASSWORD.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'PASSWORD.TOOLTIP'),
        hasBackButton: true,
      },
      {
        stepName: LoginSteps.CONFIRM_CODE,
        title: this.translateSrv.instant(ROOT_LANG + 'CODE.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'CODE.SUBTITLE', { email }),
        hasBackButton: false,
      },
    ];
  }
}
