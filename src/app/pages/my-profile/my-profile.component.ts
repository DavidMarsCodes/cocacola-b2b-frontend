import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  user: UserInfo;

  readonly LANG_ROOT = 'MY_PROFILE.HOME.';

  constructor(private modalService: NgbModal, private store: Store<{ user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
