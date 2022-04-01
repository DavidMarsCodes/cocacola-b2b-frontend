import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Client } from 'src/app/core/models/client.model';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { updateInvoiceDeadline, updateVisitDate } from 'src/app/core/state/actions/cart.actions';
import { getClientVisitDates } from 'src/app/core/state/reducers/client.reducer';
import { ParserUtils } from 'src/app/core/utils/parser-utils';
@Component({
  selector: 'app-s1-delivery-date',
  templateUrl: './s1-delivery-date.component.html',
  styleUrls: ['./s1-delivery-date.component.scss'],
})
export class S1DeliveryDateComponent implements OnInit, OnDestroy {
  deadline: string;
  visitDate: any;
  visitDates: any[];
  dateFilter;
  isValidDate = true;
  client: Client;
  isFirstDeliveryDateProp: boolean;

  private subscriptions = new Subscription();

  constructor(
    private store: Store<{ cart: Cart; client: Client }>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private visitPlanService: VisitPlanService,
    private toastrService: ToastrService
  ) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(
      this.store.select('cart').subscribe((cart) => {
        this.visitDate = cart.visitDate;
        this.deadline = cart.invoiceDeadline ? ParserUtils.parseDateToHHMM(cart.invoiceDeadline) : '';
        this.isFirstDeliveryDateProp = this.isFirstDeliveryDate(this.visitDate);
      })
    );
    this.subscriptions.add(
      this.store.select(getClientVisitDates).subscribe((visitDates) => {
        this.visitDates = visitDates;
        const visitDatesMoment = visitDates?.map((date) => {
          return moment.utc(date.visitDate).startOf('day');
        });
        this.dateFilter = (matDate: Moment) => {
          return visitDatesMoment.some((visitDate) => visitDate.isSame(matDate));
        };
      })
    );
  }

  ngOnInit(): void {
    // this.showDeadline = this.isFirstDeliveryDate();
  }

  changeStep(): void {
    if (!this.isValidDate) return;
    if (this.activatedRoute.snapshot.params.stepId) {
      this.router.navigate(['../', 2], { relativeTo: this.activatedRoute.parent });
    } else {
      this.router.navigate([2], { relativeTo: this.activatedRoute.parent });
    }
  }

  async updateVisitDate(type: string, event: MatDatepickerInputEvent<Date>): Promise<any> {
    const datePicked = event.value.toISOString();
    if (!this.isValidDateFunction(datePicked)) return;
    this.store.dispatch(updateVisitDate({ date: datePicked }));
    await this.setOperationDate();
    this.getInvoiceDeadline();
  }

  setOperationDate(): Promise<any> {
    return this.visitPlanService.setOperationDate().toPromise();
  }

  getInvoiceDeadline(): void {
    this.visitPlanService.getInvoiceDeadline().subscribe((res) => {
      if (res.data) {
        this.store.dispatch(updateInvoiceDeadline({ invoiceDeadline: res.data.deadlineTime }));
      }
    });
  }

  isValidDateFunction(datePicked): boolean {
    this.isValidDate = this.visitDates.some((date) => datePicked === date.visitDate);
    if (!this.isValidDate) this.toastrService.error('La fecha seleccionada es inválida');
    return this.isValidDate;
  }

  isFirstDeliveryDate(visitDate): boolean {
    const visitDateIndex = this.client.data.visitDates.findIndex((date) => {
      return moment(date.visitDate).isSame(moment(visitDate));
    });
    return visitDateIndex === 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
