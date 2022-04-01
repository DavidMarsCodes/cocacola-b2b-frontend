import { Component, Input, OnInit } from '@angular/core';
import { OrderDetail } from 'src/app/core/models/order-detail.model';
import { Product } from 'src/app/core/models/product.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-ka-my-order-detail-table',
  templateUrl: './ka-my-order-detail-table.component.html',
  styleUrls: ['./ka-my-order-detail-table.component.scss'],
})
export class KaMyOrderDetailTableComponent implements OnInit {
  @Input() products: Product[];
  readonly ROOT = 'MY_ORDERS.ORDER_DETAIL_TABLE.';

  groupProducts: any;
  constructor() {}

  ngOnInit(): void {
    this.groupProducts = _.groupBy(this.products, (product) => product?.productGroupName[0]?.name);
  }

  parseInt(erpCode): any {
    return parseInt(erpCode) || '-';
  }
}
