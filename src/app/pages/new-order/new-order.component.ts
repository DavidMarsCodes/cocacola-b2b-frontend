import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/core/models/cart.model';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { cleanCart } from 'src/app/core/state/actions/cart.actions';
import { DeadlineWarnModalComponent } from './modals/deadline-warn-modal/deadline-warn-modal.component';
import { AlertWarmModalComponent } from './modals/alert-warm-modal/alert-warm-modal.component';
import { NewOrderService } from './services/new-order.service';
import { DeadlineExceededModalComponent } from './steps/s4-detail/deadline-exceeded-modal/deadline-exceeded-modal.component';
import { Client } from 'src/app/core/models/client.model';
import * as moment from 'moment';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { filter } from 'rxjs/operators';
import { CreditInfo } from 'src/app/core/models/credit-info.model';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
})
export class NewOrderComponent implements OnInit, OnDestroy {
  currentStep: any;
  suggestedProducts: Product[];
  productsCombo: any;
  currentCart: any = [];
  subscriptions = new Subscription();
  steps: any[];
  subStep: string;
  cart: Cart;
  client: Client;
  user: UserInfo;
  credits: CreditInfo;
  deadlineExpInterval;
  firstDeadlineWarn = false;
  secondDeadlineWarn = false;
  readonly ROOT = 'NEW_ORDER.';

  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private newOrderService: NewOrderService,
    private store: Store<{ cart: Cart; client: Client; user: UserInfo }>,
    private modalService: NgbModal
  ) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.steps = this.getNewOrderSteps();
    this.subscriptions.add(
      this.route.params.subscribe((params: Params) => {
        const stepId = parseInt(params?.stepId) || 1;
        this.currentStep = this.steps[stepId - 1];
        this.steps.forEach((step) => {
          step.active = step.id === stepId;
        });
      })
    );
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.subStep = params?.grupo;
      })
    );
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));

    this.deadlineExpInterval = setInterval(() => {
      this.controlDeadlineExpiration();
    }, 1000);
  }

  ngOnInit(): void {
    this.productsService.getSuggestedProducts(0, false, true).subscribe((res) => (this.suggestedProducts = res.data));

    const subscribe: Subscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      //this.preventNavigation(event);
    });

    this.subscriptions.add(subscribe);
  }

  changeStepFromStepper(stepSelectedId): void {
    if (stepSelectedId < this.currentStep.id && this.currentStep.id != 6) {
      this.router.navigate(['../', stepSelectedId], { relativeTo: this.activatedRoute.parent });
    }
  }

  changeStep(stepSelectedId): void {
    this.router.navigate(['../', stepSelectedId], { relativeTo: this.activatedRoute.parent });
  }

  changeCart(cart): void {
    this.currentCart = cart;
  }

  getNewOrderSteps(): any[] {
    return [
      {
        id: 1,
        langKey: 'DATE',
        active: false,
        icon: 'calendar-event',
      },
      {
        id: 2,
        langKey: 'ORDER',
        active: false,
        icon: 'shopping-cart',
        showCart: true,
        shouldEndBuy: true,
      },
      {
        // My Order mobile
        id: 3,
        langKey: '',
        active: false,
        icon: '',
        isMobile: true,
      },
      {
        id: 4,
        langKey: 'DETAIL',
        active: false,
        icon: 'file-invoice',
        showSuggestedProducts: true,
      },
      {
        id: 5,
        langKey: 'MINI-CREDIT',
        active: false,
        icon: 'credit-card',
        shouldStepShow: this.user.countryId == 'AR',
      },
      {
        id: 6,
        langKey: 'CONFIRMATION',
        active: false,
        icon: 'truck',
      },
    ];
  }

  alertWarm(): void {
    if (this.cart.products.length > 1) return;
    const alertWarmModal = this.modalService.open(AlertWarmModalComponent, { windowClass: 'ngbmodal-centered' });
  }

  createOrder(): void {
    if (!this.cart.minPurchaseReached) return;
    this.newOrderService.createOrder().subscribe((res) => {
      this.router.navigate(['../', 6], { relativeTo: this.activatedRoute.parent });
    });
  }

  controlDeadlineExpiration(): void {
    if (!this.isFirstDeliveryDate() || !this.cart.invoiceDeadline) return;
    const milisecondsDiff = new Date(this.cart.invoiceDeadline).getTime() - new Date().getTime();
    const minutesDiff = milisecondsDiff / 1000 / 60;

    if (minutesDiff < 10 && minutesDiff > 0 && !this.firstDeadlineWarn) {
      this.firstDeadlineWarn = true;
      const deadlineModal = this.modalService.open(DeadlineWarnModalComponent, { windowClass: 'ngbmodal-centered' });
      deadlineModal.componentInstance.timeRemaining = parseInt(minutesDiff + 1 + '');
    }

    if (minutesDiff < 0 && !this.secondDeadlineWarn) {
      this.secondDeadlineWarn = true;
      this.modalService.open(DeadlineExceededModalComponent, { windowClass: 'ngbmodal-centered' });
    }
  }

  isFirstDeliveryDate(): boolean {
    const visitDateIndex = this.client.data.visitDates.findIndex((date) => {
      return moment(date.visitDate).isSame(moment(this.cart.visitDate));
    });
    return visitDateIndex === 0;
  }

  ngOnDestroy(): void {
    clearInterval(this.deadlineExpInterval);
    this.store.dispatch(cleanCart());
    this.subscriptions.unsubscribe();
  }
}
