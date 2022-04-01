import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginOptions: any[];
  countryCode: CountryCodes;
  private subscriptions = new Subscription();

  constructor(private router: Router, private translateSrv: TranslateService, private store: Store<{ userLocal: UserLocal }>) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.translateSrv.use(this.countryCode).subscribe(() => {
      this.loginOptions = this.getLoginHomeOptions();
    });
    this.translateSrv.onLangChange.subscribe(() => {
      this.loginOptions = this.getLoginHomeOptions();
    });
  }

  navigateTo(route): void {
    this.router.navigate([route]);
  }

  getLoginHomeOptions(): any[] {
    const ROOT_LANG = 'LOGIN.HOME.';
    return [
      {
        id: 'ingresar-a-mi-cuenta',
        title: this.translateSrv.instant(ROOT_LANG + 'SIGN_IN.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'SIGN_IN.SUBTITLE'),
        icon: './assets/svg/smile.svg',
        routerLink: 'sign-in',
      },
      {
        id: 'quiero-registrarme',
        title: this.translateSrv.instant(ROOT_LANG + 'SIGN_UP.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'SIGN_UP.SUBTITLE'),
        icon: './assets/svg/people.svg',
        routerLink: 'sign-up',
      },
      {
        id: 'dar-de-alta-mi-negocio',
        title: this.translateSrv.instant(ROOT_LANG + 'NEW_CLIENT.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'NEW_CLIENT.SUBTITLE'),
        icon: './assets/svg/phone-ringing.svg',
        routerLink: 'new-client',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
