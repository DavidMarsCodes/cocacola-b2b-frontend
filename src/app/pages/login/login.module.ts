import { NgModule } from '@angular/core';
import { LoginStepsService } from './services/login-steps.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewClientComponent } from './new-client/new-client.component';
import { PrivacyTermsComponent } from './privacy-terms/privacy-terms.component';
import { LoginComponent } from './login.component';
import { KaLoginNavbarComponent } from './components/ka-login-navbar/ka-login-navbar.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { KaDotStepperComponent } from './components/ka-dot-stepper/ka-dot-stepper.component';
import { TycModalComponent } from './components/tyc-modal/tyc-modal.component';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    if (params.interpolateParams) {
      return params.interpolateParams['Default'] || params.key;
    }
    return params.key;
  }
}
@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    SignInComponent,
    NewClientComponent,
    PrivacyTermsComponent,
    KaLoginNavbarComponent,
    KaDotStepperComponent,
    TycModalComponent,
  ],
  imports: [
    LoginRoutingModule,
    SharedModule,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      extend: true,
    }),
  ],
  providers: [LoginStepsService, HttpClient],
})
export class LoginModule {}
