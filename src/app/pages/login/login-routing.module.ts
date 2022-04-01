import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { NewClientComponent } from './new-client/new-client.component';
import { PrivacyTermsComponent } from './privacy-terms/privacy-terms.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'new-client', component: NewClientComponent },
  { path: 'privacy-terms', component: PrivacyTermsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
