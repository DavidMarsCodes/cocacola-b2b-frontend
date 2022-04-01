import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { SelectClientService } from 'src/app/core/services/select-client.service';
import { ClientDiscretionaryDiscount } from 'src/app/core/models/benefit.model';
import { MyCreditModel } from 'src/app/core/models/my-account.model';

@Component({
  selector: 'app-ka-select-commerce',
  templateUrl: './ka-select-commerce.component.html',
  styleUrls: ['./ka-select-commerce.component.scss'],
})
export class KaSelectCommerceComponent implements OnInit, OnDestroy {
  @Input() minimalist? = false;
  private subscriptions = new Subscription();
  suggestedProducts: any[] = [];
  clients: Client[];
  selectedClient: Client;

  constructor(private store: Store<{ user: UserInfo; client: Client }>, private selectClientService: SelectClientService) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.clients = user.clients)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.selectedClient = client;
        const sugProd = [...client?.data?.suggestedProducts?.slice(0, 4)];
        this.suggestedProducts = sugProd.map((prod) => ({ ...prod }));
      })
    );
  }

  ngOnInit(): void {}

  selectClient(client): void {
    this.selectClientService.selectClient(client);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
