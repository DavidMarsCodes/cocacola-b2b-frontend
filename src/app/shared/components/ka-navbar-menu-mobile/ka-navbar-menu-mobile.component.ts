import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { logout } from 'src/app/core/state/actions/user.actions';

@Component({
  selector: 'app-ka-navbar-menu-mobile',
  templateUrl: './ka-navbar-menu-mobile.component.html',
  styleUrls: ['./ka-navbar-menu-mobile.component.scss'],
})
export class KaNavbarMenuMobileComponent implements OnInit, OnDestroy {
  user: UserInfo;
  isNewOrder = false;
  private subscriptions = new Subscription();

  constructor(private router: Router, private store: Store<{ user: UserInfo }>) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[2];
        this.isNewOrder = currentRoute === 'nuevo-pedido';
      }
    });
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {}

  signOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
