import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-ka-add-users',
  templateUrl: './ka-add-users.component.html',
  styleUrls: ['./ka-add-users.component.scss'],
})
export class KaAddUsersComponent implements OnInit {
  private subscriptions = new Subscription();
  user: UserInfo;

  constructor(private store: Store<{ user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
