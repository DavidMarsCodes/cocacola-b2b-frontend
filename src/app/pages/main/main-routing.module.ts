import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancelOrderGuard } from 'src/app/core/guards/cancel-order.guard';
import { NewOrderGuard } from 'src/app/core/guards/new-order.guard';
import { KaNotFoundComponent } from '../page-not-found/components/not-found/not-found.component';
import { BenefitsGuard } from 'src/app/core/guards/benefits.guard';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,

    children: [
      {
        path: 'home',
        loadChildren: () => import('./../home/home.module').then((m) => m.HomeModule),
      },

      {
        path: 'nuevo-pedido',
        loadChildren: () => import('./../new-order/new-order.module').then((m) => m.NewOrderModule),
      },
      {
        path: 'nuevo-pedido/:stepId',
        loadChildren: () => import('./../new-order/new-order.module').then((m) => m.NewOrderModule),
        canActivate: [NewOrderGuard],
        canDeactivate: [CancelOrderGuard],
      },
      {
        path: 'mis-pedidos',
        loadChildren: () => import('./../my-orders/my-orders.module').then((m) => m.MyOrdersModule),
      },
      {
        path: 'mis-pedidos/:clientId',
        loadChildren: () => import('./../my-orders/my-orders.module').then((m) => m.MyOrdersModule),
      },
      {
        path: 'mi-saldo',
        loadChildren: () => import('./../my-account/my-account.module').then((m) => m.MyAccountModule),
      },
      {
        path: 'mi-perfil',
        loadChildren: () => import('./../my-profile/my-profile.module').then((m) => m.MyProfileModule),
      },

      {
        path: 'mis-promociones',
        loadChildren: () => import('./../my-benefits/my-benefits.module').then((m) => m.MyBenefitsModule),
        canActivate: [BenefitsGuard],
      },
      {
        path: '**',
        component: KaNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
