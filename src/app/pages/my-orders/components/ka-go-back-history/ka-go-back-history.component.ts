import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-ka-go-back-history',
  templateUrl: './ka-go-back-history.component.html',
  styleUrls: ['./ka-go-back-history.component.scss'],
})
export class KaGoBackHistoryComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  user: UserInfo;

  constructor(private store: Store<{ user: UserInfo; client: Client }>, private router: Router) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {}

  goBack(): void {
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        if (!this.user.uuid) {
          this.router.navigate(['/main/mis-pedidos/' + client.clientId]);
        } else {
          this.router.navigate(['/mcc/mis-pedidos/' + client.clientId]);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
