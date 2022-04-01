import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { UserLocal } from 'src/app/core/models/user-local.model';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  countryCode: CountryCodes;

  constructor(private router: Router, private store: Store<{ userLocal: UserLocal }>, private translateService: TranslateService) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.translateService.use(this.countryCode);
  }

  returnHomeLogin(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
