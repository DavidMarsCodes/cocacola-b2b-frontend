import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { CognitoService } from './services/cognito.service';
import { EncrDecrService } from './services/encr-decr.service';
import { ModalsService } from './services/modals.service';
import { DiscretionaryDiscountService } from './services/benefits.service';
import { GeoLocationService } from './services/geo-location.service';
import { AwsInterceptor } from './interceptors/aws.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { NewOrderGuard } from './guards/new-order.guard';
import { CancelOrderGuard } from './guards/cancel-order.guard';
import { BenefitsGuard } from './guards/benefits.guard';
import { VisitPlanService } from './services/visit-plan.service';
import { AlertWarmModalComponent } from '../pages/new-order/modals/alert-warm-modal/alert-warm-modal.component';
import { AuthExternalGuard } from './guards/authExternal.guard';
import { MyAccountService } from '../pages/my-account/services/my-account.service';

const coreServices = [
  CartService,
  ApiService,
  UserService,
  CognitoService,
  VisitPlanService,
  GeoLocationService,
  EncrDecrService,
  ModalsService,
  DiscretionaryDiscountService,
  MyAccountService,
];

const guards = [AuthGuard, AuthExternalGuard, LoginGuard, NewOrderGuard, CancelOrderGuard, BenefitsGuard];

@NgModule({
  imports: [CommonModule, ToastrModule.forRoot()],
  entryComponents: [AlertWarmModalComponent],
  providers: [...coreServices, ...guards, { provide: HTTP_INTERCEPTORS, useClass: AwsInterceptor, multi: true }],
  exports: [],
})
export class CoreModule {}
