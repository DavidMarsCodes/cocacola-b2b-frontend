import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile.component';
import { KaEditPasswordComponent } from './components/ka-edit-password/ka-edit-password.component';
import { KaAddUsersComponent } from './components/ka-add-users/ka-add-users.component';

const routes: Routes = [
  { path: '', component: MyProfileComponent },
  { path: 'password/editar', component: KaEditPasswordComponent },
  { path: 'usuarios/agregar', component: KaAddUsersComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfileRoutingModule {}
