import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { OrderDetail } from 'src/app/core/models/order-detail.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { Product } from 'src/app/core/models/product.model';
import { ProductsCalcs } from 'src/app/core/utils/products-calcs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ka-my-order-detail-resume',
  templateUrl: './ka-my-order-detail-resume.component.html',
  styleUrls: ['./ka-my-order-detail-resume.component.scss'],
})
export class KaMyOrderDetailResumeComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() orderDetail: OrderDetail;
  user: UserInfo;
  readonly CountryCodes = CountryCodes;
  readonly env = environment;
  readonly ROOT = 'NEW_ORDER.RIGHT_SIDEBAR.';

  orderTotals = {
    finalPrice: 0,
    listPrice: 0,
    discounts: 0,
    finalTaxes: 0,
  };

  constructor(private store: Store<{ user: UserInfo }>) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    this.orderTotals.finalPrice = ProductsCalcs.getTotalFinalPrice(this.orderDetail.products);
    this.orderTotals.listPrice = ProductsCalcs.getTotalListPrice(this.orderDetail.products);
    this.orderTotals.finalTaxes = ProductsCalcs.getTotalFinalTaxes(this.orderDetail.products);
    this.orderTotals.discounts = ProductsCalcs.getTotalDiscounts(this.orderDetail.products);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
