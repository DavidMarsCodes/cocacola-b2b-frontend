import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { Cart } from 'src/app/core/models/cart.model';
import { updateInvoiceDeadline, updateVisitDate, updateFrozenVisitDate } from 'src/app/core/state/actions/cart.actions';
import { getCartVisitDate, getCartFrozenVisitDate } from 'src/app/core/state/reducers/cart.reducer';
import { Client } from 'src/app/core/models/client.model';

import { getClientVisitDates, getClientFrozenVisitDates } from 'src/app/core/state/reducers/client.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ka-select-delivery-date',
  templateUrl: './ka-select-delivery-date.component.html',
  styleUrls: ['./ka-select-delivery-date.component.scss'],
})
export class KaSelectDeliveryDateComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() titleTranslate: string;
  @Input() visitType: string;
  cart: Cart;
  visitDates: any[];
  selectedDate: any;

  constructor(private store: Store<{ cart: Cart; client: Client }>, private visitPlanService: VisitPlanService) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    if (this.visitType !== 'deliveryfrozen') {
      this.subscriptions.add(
        this.store.select(getCartVisitDate).subscribe((newVisitDate) => {
          this.selectedDate = newVisitDate ? new Date(newVisitDate).toISOString() : '';
        })
      );
      this.subscriptions.add(this.store.select(getClientVisitDates).subscribe((visitDates) => (this.visitDates = visitDates)));
    }
  }

  ngOnInit(): void {
    this.getFrozenDates();
  }

  getFrozenDates(): void {
    if (this.visitType === 'deliveryfrozen') {
      this.subscriptions.add(
        this.store.select(getCartFrozenVisitDate).subscribe((newVisitDate) => {
          this.selectedDate = newVisitDate ? new Date(newVisitDate).toISOString() : '';
        })
      );
      this.subscriptions.add(this.store.select(getClientFrozenVisitDates).subscribe((visitDates) => (this.visitDates = visitDates)));
    }
  }

  async selectDate(date: any): Promise<any> {
    this.selectedDate = date;
    if (this.visitType !== 'deliveryfrozen') {
      this.store.dispatch(updateVisitDate({ date }));
    } else {
      this.store.dispatch(updateFrozenVisitDate({ date }));
    }
    await this.setOperationDate();
    this.getInvoiceDeadline();
  }

  setOperationDate(): Promise<any> {
    return this.visitPlanService.setOperationDate(this.visitType).toPromise();
  }

  getInvoiceDeadline(): void {
    this.visitPlanService.getInvoiceDeadline().subscribe((res) => {
      if (res.data) {
        this.store.dispatch(updateInvoiceDeadline({ invoiceDeadline: res.data.deadlineTime }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
