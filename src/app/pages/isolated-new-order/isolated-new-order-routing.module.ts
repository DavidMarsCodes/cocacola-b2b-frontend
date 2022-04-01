import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsolatedNewOrderComponent } from './isolated-new-order.component';

const routes: Routes = [
  {
    path: '',
    component: IsolatedNewOrderComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../new-order/new-order.module').then((m) => m.NewOrderModule),
      },
      {
        path: 'mcc/:stepId',
        loadChildren: () => import('./../new-order/new-order.module').then((m) => m.NewOrderModule),
      },
      {
        path: 'mcc/mi-saldo',
        loadChildren: () => import('./../my-account/my-account.module').then((m) => m.MyAccountModule),
      },
      {
        path: 'mcc/mis-pedidos',
        loadChildren: () => import('./../my-orders/my-orders.module').then((m) => m.MyOrdersModule),
      },
      {
        path: 'mcc/mis-pedidos/:clientId',
        loadChildren: () => import('./../my-orders/my-orders.module').then((m) => m.MyOrdersModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IsolatedNewOrderRoutingModule {}
