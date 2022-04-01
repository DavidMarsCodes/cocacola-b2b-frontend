import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from './../models/user-info.model';
@Injectable()
export class BenefitsGuard implements CanActivate, OnDestroy {
  private subscriptions = new Subscription();
  user: UserInfo;

  constructor(public router: Router, private store: Store<{ user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAllowed = this.user.countryId === 'CL' ? true : false;
    if (!isAllowed) {
      this.router.navigate(['/main/not-found'], {
        skipLocationChange: true,
      });
    }
    return isAllowed;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
