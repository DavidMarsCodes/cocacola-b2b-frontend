import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import * as CartActions from 'src/app/core/state/actions/cart.actions';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-deadline-exceeded-modal',
  templateUrl: './deadline-exceeded-modal.component.html',
  styleUrls: ['./deadline-exceeded-modal.component.scss'],
})
export class DeadlineExceededModalComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  readonly LANG_ROOT = 'NEW_ORDER.ORDER_DETAIL.MODAL_DEADLINE.';
  cart: Cart;
  showDeliveryDate = false;

  constructor(
    public activeModal: NgbActiveModal,
    private visitPlanService: VisitPlanService,
    private store: Store<{ cart: Cart }>,
    private actionListener$: ActionsSubject
  ) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
  }

  ngOnInit(): void {
    this.updateVisitPlan();
  }

  updateVisitPlan(): void {
    this.visitPlanService.getClientVisitPlan().subscribe(
      async (res) => {
        this.store.dispatch(ClientActions.loadVisitDates({ visitDates: res.data }));
        this.store.dispatch(CartActions.updateVisitDate({ date: res?.data[0]?.visitDate }));
        await this.setOperationDate();
        this.getInvoiceDeadline();
        this.showDeliveryDate = true;
      },
      (error) => this.store.dispatch(ClientActions.loadVisitDates({ visitDates: [] }))
    );
  }

  reloadProducts(): void {
    // this.subscriptions.add(
    //   this.actionListener$.pipe(filter((action) => action.type === CartActions.loadProductDiscountsSuccess.type)).subscribe(() => {
    //     this.activeModal.close();
    //   })
    // );
    this.activeModal.close();
    this.store.dispatch(CartActions.updateAllProducts({ products: this.cart.products }));
  }

  setOperationDate(): Promise<any> {
    return this.visitPlanService.setOperationDate().toPromise();
  }

  getInvoiceDeadline(): void {
    this.visitPlanService.getInvoiceDeadline().subscribe((res) => {
      if (res.data) {
        this.store.dispatch(CartActions.updateInvoiceDeadline({ invoiceDeadline: res.data.deadlineTime }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
