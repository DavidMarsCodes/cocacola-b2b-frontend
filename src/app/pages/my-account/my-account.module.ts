import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { KaAvailableCategoryCreditsComponent } from './components/ka-available-category-credits/ka-available-category-credits.component';
import { KaAccountStatusComponent } from './components/ka-account-status/ka-account-status.component';
import { MyAccountService } from './services/my-account.service';

@NgModule({
  declarations: [MyAccountComponent, KaAvailableCategoryCreditsComponent, KaAccountStatusComponent],
  imports: [CommonModule, CoreModule, SharedModule, MyAccountRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [MyAccountService],
})
export class MyAccountModule {}
