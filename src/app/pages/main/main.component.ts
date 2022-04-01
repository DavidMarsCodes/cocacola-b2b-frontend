import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { Cart } from 'src/app/core/models/cart.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Client } from 'src/app/core/models/client.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { ModalsService } from 'src/app/core/services/modals.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { updateInvoiceDeadline, updateVisitDate } from 'src/app/core/state/actions/cart.actions';
import { loadSuggestedProducts, loadVisitDates } from 'src/app/core/state/actions/client.actions';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  cart: Cart;
  selectedClient: Client;
  countryCode: CountryCodes;
  translateReady = false;
  sessionReady = false;

  constructor(
    private translateService: TranslateService,
    private store: Store<{ client: Client; cart: Cart; user: UserInfo }>,
    private visitPlanService: VisitPlanService,
    private productsService: ProductsService,
    private congnitoService: CognitoService,
    private gtmService: GoogleTagManagerService,
    private modalsService: ModalsService,
    private userService: UserService
  ) {
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.countryCode = user.countryId as CountryCodes)));
  }

  ngOnInit(): void {
    this.gtmService.pushTag({ event: 'main' });
    this.translateService.use(this.countryCode).subscribe((res) => (this.translateReady = true));
    this.handleRefreshSession();
  }

  handleRefreshSession(): void {
    this.congnitoService.refreshUserSession().subscribe(
      () => this.getVisitDates(),
      (error) => this.getVisitDates()
    );
  }

  getVisitDates(): void {
    this.sessionReady = true;
    if (this.selectedClient.hasLockOrder) {
      this.modalsService.openClientOrderBlockedModal();
      return;
    }
    this.visitPlanService.getClientVisitPlan().subscribe(
      async (res) => {
        this.store.dispatch(loadVisitDates({ visitDates: res.data }));
        // @ts-ignore
        const isDateSelectedValid = this.cart?.visitDate && res?.data?.some((date) => date.visitDate === this.cart.visitDate.toISOString());
        if (!isDateSelectedValid && res?.data) {
          this.store.dispatch(updateVisitDate({ date: res?.data[0]?.visitDate }));
        }
        await this.setOperationDate();
        this.userService.initClientSession().subscribe();
        this.getInvoiceDeadline();
        this.getSuggestedProducts();
      },
      (error) => {
        this.store.dispatch(updateVisitDate({ date: '' }));
        this.store.dispatch(loadVisitDates({ visitDates: [] }));
      }
    );
  }

  setOperationDate(): Promise<any> {
    return this.visitPlanService.setOperationDate().toPromise();
  }

  getSuggestedProducts(): void {
    this.productsService.getSuggestedProducts(0, true, true).subscribe(
      (res) => this.store.dispatch(loadSuggestedProducts({ suggestedProducts: res.data })),
      (error) => this.store.dispatch(loadSuggestedProducts({ suggestedProducts: [] }))
    );
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
