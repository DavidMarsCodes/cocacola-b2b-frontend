import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KaMyOrdersDetailComponent } from './components/ka-my-orders-detail/ka-my-orders-detail.component';
import { MyOrdersComponent } from './my-orders.component';

const routes: Routes = [
  { path: '', component: MyOrdersComponent },
  { path: 'detalles/:orderId', component: KaMyOrdersDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyOrdersRoutingModule {}
