import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { UserService } from 'src/app/core/services/user.service';
import { VisitPlanService } from 'src/app/core/services/visit-plan.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { updateInvoiceDeadline, updateVisitDate } from 'src/app/core/state/actions/cart.actions';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import { OrdersService } from 'src/app/pages/my-orders/services/orders.service';
import { ModalsService } from 'src/app/core/services/modals.service';
import { loadSuggestedProducts } from 'src/app/core/state/actions/client.actions';
import { ClientDiscretionaryDiscount } from 'src/app/core/models/benefit.model';
import { DiscretionaryDiscountService } from 'src/app/core/services/benefits.service';
import { Router } from '@angular/router';
import { MyAccountService } from 'src/app/pages/my-account/services/my-account.service';
import { MyCreditModel } from 'src/app/core/models/my-account.model';

@Injectable({
  providedIn: 'root',
})
export class SelectClientService implements OnDestroy {
  private subscriptions = new Subscription();
  suggestedProducts: any[] = [];
  clients: Client[];
  selectedClient: Client;
  discounts: ClientDiscretionaryDiscount[] = [];
  credits: MyCreditModel[];
  userCountryId: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<{ user: UserInfo; client: Client }>,
    private visitPlanService: VisitPlanService,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private modalsService: ModalsService,
    private discretionaryDiscountService: DiscretionaryDiscountService,
    private myAccountService: MyAccountService
  ) {
    this.subscriptions.add(
      this.store.select('user').subscribe((user) => {
        this.userCountryId = user.countryId;
        this.clients = user.clients;
      })
    );
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.selectedClient = client)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.selectedClient = client;
        const sugProd = [...client?.data?.suggestedProducts?.slice(0, 4)];
        this.suggestedProducts = sugProd.map((prod) => ({ ...prod }));
      })
    );
  }

  selectClient(client): void {
    if (!client.clientId) {
      client = this.clients.find((selectedClient) => selectedClient.clientId == client);
    }

    this.store.dispatch(ClientActions.updateClient({ client: client }));

    if (client.hasLockOrder) {
      this.modalsService.openClientOrderBlockedModal();
      return;
    }
    this.getVisitDates();
    this.getClientOrders();
    this.initClientSession();
    this.getDiscretionaryDiscount();
    if (this.userCountryId !== 'AR' && this.router.url.split('/')[1] === 'mi-saldo') this.getAvailableCredits();
  }

  getAvailableCredits(): void {
    this.myAccountService.getAvailableCredits().subscribe(
      async (res) => {
        this.credits = res;
        this.store.dispatch(ClientActions.loadCredits({ credits: this.credits }));
      },
      (error) => {
        this.store.dispatch(ClientActions.loadCredits({ credits: [] }));
      }
    );
  }

  initClientSession(): void {
    this.userService.initClientSession().subscribe();
  }

  getDiscretionaryDiscount(): void {
    if (this.router.url.split('/')[2] === 'mis-promociones') {
      this.discretionaryDiscountService.getBenefitsClient().subscribe(
        async (res) => {
          this.discounts = res.data;
          this.store.dispatch(ClientActions.loadDiscretionaryDiscount({ discounts: this.discounts }));
        },
        (error) => this.store.dispatch(ClientActions.loadDiscretionaryDiscount({ discounts: [] }))
      );
    }
  }

  getClientOrders(): void {
    this.ordersService.getClientOrders().subscribe(
      (orders) => this.store.dispatch(ClientActions.loadOrders({ orders: orders })),
      (error) => this.store.dispatch(ClientActions.loadOrders({ orders: null }))
    );
  }

  getVisitDates(): void {
    this.visitPlanService.getClientVisitPlan().subscribe(
      async (res) => {
        const defaultDate = res?.data[0]?.visitDate;
        this.store.dispatch(updateVisitDate({ date: defaultDate }));
        this.store.dispatch(ClientActions.loadVisitDates({ visitDates: res.data }));
        await this.setOperationDate();
        this.getInvoiceDeadline();
        this.getSuggestedProducts();
      },
      (error) => {
        this.store.dispatch(updateVisitDate({ date: '' }));
        this.store.dispatch(ClientActions.loadVisitDates({ visitDates: [] }));
        this.store.dispatch(loadSuggestedProducts({ suggestedProducts: [] }));
      }
    );
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

  getSuggestedProducts(): void {
    this.productsService.getSuggestedProducts(0, true, true).subscribe(
      (res) => this.store.dispatch(loadSuggestedProducts({ suggestedProducts: res.data })),
      (error) => this.store.dispatch(loadSuggestedProducts({ suggestedProducts: [] }))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
