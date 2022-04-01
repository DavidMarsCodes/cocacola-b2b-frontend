import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Subscription } from 'rxjs';
import { Constants } from './core/constants/constants';
import { CountryCodes } from './core/enums/country-codes.enum';
import { Client } from './core/models/client.model';
import { UserInfo } from './core/models/user-info.model';
import { UserLocal } from './core/models/user-local.model';
import { GeoLocationService } from './core/services/geo-location.service';
import * as UserLocalActions from './core/state/actions/user-local.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'cocacola-andina';
  translateReady = false;
  private subscriptions = new Subscription();
  user: UserInfo;
  userLocal: UserLocal;
  client: Client;
  currentRoute: string;
  readonly CountryCodes = CountryCodes;

  constructor(
    private router: Router,
    private gtmService: GoogleTagManagerService,
    private store: Store<{ user: UserInfo; client: Client; userLocal: UserLocal }>,
    private geoLocationSrv: GeoLocationService
  ) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.setTranslateLang();
  }

  ngOnInit(): void {
    this.setTranslateLang();
  }

  setTranslateLang(): void {
    let userCountry = this.user?.countryId || this.userLocal?.geoCountryCode;

    if (userCountry) {
      this.loadCountry(userCountry);
    } else {
      this.loadCountryCodeByGeo();
    }
  }

  loadCountryCodeByGeo(): void {
    this.geoLocationSrv.getIpAddress().subscribe(
      (resp) => {
        this.geoLocationSrv.getLocationByIp(resp.ip).subscribe(
          (res) => {
            const selectedCountry = Constants.countries.find((country) => country.key === res.data.country);
            this.loadCountry(selectedCountry ? res.data.country : CountryCodes.CHILE);
          },
          (error) => {
            this.loadCountry(CountryCodes.CHILE);
          }
        );
      },
      (error) => {
        this.loadCountry(CountryCodes.CHILE);
      }
    );
  }

  private loadCountry(countryCode): void {
    this.store.dispatch(UserLocalActions.loadGeoCountryCode({ countryCode: countryCode }));
    const selectedCountry = Constants.countries.find((country) => country.key === countryCode);
    this.store.dispatch(UserLocalActions.loadOrganizationId({ organizationId: selectedCountry.organizationId }));
    this.translateReady = true;
    this.initGTMRouterEvents();
  }

  initGTMRouterEvents(): void {
    this.router.events.forEach((item) => {
      let geoCountryCode = this.user?.countryId ? this.user.countryId : this.userLocal.geoCountryCode;
      const countryLocal = Constants.countries.find((country) => country.key === geoCountryCode);

      if (item instanceof NavigationEnd && item.url !== this.currentRoute) {
        this.currentRoute = item.url;
        const gtmTag = {
          event: 'ngRouteChange',
          pageName: item.url,
          user: this.user?.userId ? { ...this.user, jwt: '', clients: [] } : undefined,
          client: this.client?.clientId ? this.client : undefined,
          country: {
            isoCodeCountry: countryLocal?.key,
            labelCountry: countryLocal?.label,
          },
        };
        this.gtmService.pushTag(gtmTag);
      }
    });
  }
}
