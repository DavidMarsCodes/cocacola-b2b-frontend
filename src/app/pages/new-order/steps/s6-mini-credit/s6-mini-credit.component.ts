import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { ModalsService } from 'src/app/core/services/modals.service';

@Component({
  selector: 'app-s6-mini-credit',
  templateUrl: './s6-mini-credit.component.html',
  styleUrls: ['./s6-mini-credit.component.scss'],
})
export class S6MiniCreditComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  cart: Cart;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private store: Store<{ cart: Cart }>, private modalsService: ModalsService) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  ngOnInit(): void {}

  changeStep(step): void {
    this.router.navigate(['../', step], { relativeTo: this.activatedRoute.parent });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
