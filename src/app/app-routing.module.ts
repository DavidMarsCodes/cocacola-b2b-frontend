import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthExternalGuard } from './core/guards/authExternal.guard';
import { LoginGuard } from './core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'mcc',
    loadChildren: () => import('./pages/isolated-new-order/isolated-new-order.module').then((m) => m.IsolatedNewOrderModule),
  },
  {
    path: 'mcc/:stepId',
    loadChildren: () => import('./pages/isolated-new-order/isolated-new-order.module').then((m) => m.IsolatedNewOrderModule),
    canActivate: [AuthExternalGuard],
  },
  {
    path: 'mcc/mi-saldo',
    loadChildren: () => import('./pages/isolated-new-order/isolated-new-order.module').then((m) => m.IsolatedNewOrderModule),
    canActivate: [AuthExternalGuard],
  },
  {
    path: 'mcc/mis-pedidos',
    loadChildren: () => import('./pages/isolated-new-order/isolated-new-order.module').then((m) => m.IsolatedNewOrderModule),
    canActivate: [AuthExternalGuard],
  },
  {
    path: 'mcc/mis-pedidos/:clientId',
    loadChildren: () => import('./pages/isolated-new-order/isolated-new-order.module').then((m) => m.IsolatedNewOrderModule),
    canActivate: [AuthExternalGuard],
  },
  {
    path: '**',
    loadChildren: () => import('./pages/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
