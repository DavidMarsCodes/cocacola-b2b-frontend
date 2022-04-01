import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyBenefitsComponent } from './my-benefits.component';

const routes: Routes = [{ path: '', component: MyBenefitsComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyBenefitsRoutingModule {}
