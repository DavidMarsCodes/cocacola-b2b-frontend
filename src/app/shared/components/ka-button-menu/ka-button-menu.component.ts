import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'src/app/core/models/client.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ka-button-menu',
  templateUrl: './ka-button-menu.component.html',
  styleUrls: ['./ka-button-menu.component.scss'],
})
export class KaButtonMenuComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  @Input() title: string;
  @Input() subtitle: string;
  @Input() icon: string;
  @Input() button: string;
  @Input() alternative?: boolean;
  @Input() message?: string;
  @Input() routerLinkRoute: string;
  @Input() routerLinkQuery: string;

  selectedClient: Client;

  constructor(private router: Router, private store: Store<{ client: Client }>) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
  }

  ngOnInit(): void {}

  navigateTo(): void {
    if (this.selectedClient.hasLockOrder || this.selectedClient.data?.visitDates?.length == 0) return;
    this.router.navigate([this.routerLinkRoute], { queryParams: { grupo: this.routerLinkQuery } });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
