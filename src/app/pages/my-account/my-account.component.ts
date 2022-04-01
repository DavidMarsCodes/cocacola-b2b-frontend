import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Client } from 'src/app/core/models/client.model';
import { Subscription } from 'rxjs';
import { MyCreditModel } from 'src/app/core/models/my-account.model';
import { MyAccountService } from '../my-account/services/my-account.service';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  myCreditDetail: MyCreditModel[] = [];
  myCreditDetailReady = false;
  user: UserInfo;

  private subscriptions = new Subscription();

  constructor(private myAccountService: MyAccountService, private store: Store<{ client: Client; user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.myCreditDetail = client.data.credits;
      })
    );
  }

  ngOnInit(): void {
    this.getAvailableCredits();
  }

  getAvailableCredits(): void {
    this.myAccountService.getAvailableCredits().subscribe(
      (myAccountDetail) => {
        this.myCreditDetail = myAccountDetail;
        this.myCreditDetailReady = true;
        this.store.dispatch(ClientActions.loadCredits({ credits: this.myCreditDetail }));
      },
      (error) => {
        this.myCreditDetailReady = true;
        this.store.dispatch(ClientActions.loadCredits({ credits: [] }));
      }
    );
  }
}
