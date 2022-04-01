import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductTypes } from 'src/app/core/enums/product-types';
import { Client } from 'src/app/core/models/client.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ka-packs-and-discounts',
  templateUrl: './ka-packs-and-discounts.component.html',
  styleUrls: ['./ka-packs-and-discounts.component.scss'],
})
export class KaPacksAndDiscountsComponent implements OnInit, OnDestroy {
  client: Client;
  private subscriptions = new Subscription();
  readonly ProductTypes = ProductTypes;

  constructor(private store: Store<{ client: Client }>, private router: Router) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
  }

  ngOnInit(): void {}

  goToPack(): void {
    this.router.navigate(['/main/nuevo-pedido/2'], { queryParams: { grupo: ProductTypes.PACK } });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
