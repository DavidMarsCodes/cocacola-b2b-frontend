import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Client } from 'src/app/core/models/client.model';
import { Subscription } from 'rxjs';
import { ParserUtils } from 'src/app/core/utils/parser-utils';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';

@Component({
  selector: 'app-ka-right-sidebar',
  templateUrl: './ka-right-sidebar.component.html',
  styleUrls: ['./ka-right-sidebar.component.scss'],
})
export class KaRightSidebarComponent implements OnInit, OnDestroy {
  user: UserInfo;
  selectedClient: Client;
  fiscalId: string;
  erpClientId: string;
  private subscriptions = new Subscription();

  constructor(private store: Store<{ user: UserInfo; client: Client }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
  }

  ngOnInit(): void {
    this.fiscalId = ParserUtils.removes0FromFiscalId(this.selectedClient.fiscalId, this.user.countryId as CountryCodes);
    this.erpClientId = ParserUtils.removes0FromErpClientId(this.selectedClient.erpClientId, this.user.countryId as CountryCodes);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
