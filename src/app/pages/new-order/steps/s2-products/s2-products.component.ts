import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Cart } from 'src/app/core/models/cart.model';
import { ProductFilter } from 'src/app/core/models/product-filter.model';
import { ProductTypes } from 'src/app/core/enums/product-types';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { upsertMultipleProducts, upsertProduct } from 'src/app/core/state/actions/cart.actions';
import { Subscription } from 'rxjs';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { RegexList } from 'src/app/core/utils/regex-list.regex';
import { MyCreditModel } from 'src/app/core/models/my-account.model';
import { MyAccountService } from 'src/app/pages/my-account/services/my-account.service';
import * as ClientActions from 'src/app/core/state/actions/client.actions';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-s2-products',
  templateUrl: './s2-products.component.html',
  styleUrls: ['./s2-products.component.scss'],
})
export class S2ProductsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  @Input() primaryFilter;
  @ViewChild('infiniteContainer') infiniteContainer;
  products: Product[];
  countProducts: number;
  cart: Cart;
  user: UserInfo;
  client: Client;
  readonly ProductTypes = ProductTypes;

  categories: any[];
  packages: string[];
  sizes: string[];
  brands: string[];
  returnabilityCondition: any;
  myCreditDetail: MyCreditModel[] = [];
  productFilter: ProductFilter;

  viewGrid = true;

  ROOT_LANG = 'NEW_ORDER.MORE_PRODUCTS.';
  timeout: any;
  innerWidth: number;

  constructor(
    private productsService: ProductsService,
    private store: Store<{ cart: Cart; user: UserInfo; client: Client }>,
    private myAccountService: MyAccountService,
    private gtmService: GoogleTagManagerService
  ) {
    this.subscriptions.add(this.store.select('cart').subscribe((cart) => (this.cart = cart)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select('client').subscribe((client) => (this.client = client)));
  }

  ngOnInit(): void {
    this.resetProductFilter();
    if (this.user.countryId !== 'AR' && this.client.data.credits.length === 0) this.getAvailableCredits();
    this.innerWidth = window.innerWidth;
    this.primaryFilter = this.primaryFilter || ProductTypes.SUGGESTED;
    this.filterBy(this.primaryFilter);
    if (this.innerWidth <= 992) this.viewGrid = false;
  }

  getAvailableCredits(): void {
    this.myAccountService.getAvailableCredits().subscribe(
      (myAccountDetail) => {
        this.myCreditDetail = myAccountDetail;
        this.store.dispatch(ClientActions.loadCredits({ credits: this.myCreditDetail }));
      },
      (error) => {
        this.store.dispatch(ClientActions.loadCredits({ credits: [] }));
      }
    );
  }

  private getPortfolioFilters(filters?: ProductFilter): void {
    this.productsService.getPortfolioFilters(filters).subscribe((res) => {
      this.packages = res.data.packages;
      this.sizes = res.data.sizes;
      this.brands = res.data.brands;
      this.returnabilityCondition = res.data.returnabilities;
      this.categories = res.data.categories;
    });
  }

  // private getProductcategories(): void {
  //   this.productsService.getProductcategories().subscribe((res) => {
  //     this.categories = res;
  //   });
  // }

  filterBy(filter: ProductTypes): void {
    switch (filter) {
      case ProductTypes.SUGGESTED:
        this.productsService.getSuggestedProducts(0, true, false).subscribe(
          (res) => this.fillProductsCards(res, filter),
          (error) => this.cleanProductCards(filter)
        );
        break;
      case ProductTypes.UNIT:
        if (this.innerWidth >= 992) this.getPortfolioFilters();
        this.resetProductFilter();
        this.productsService.getPortfolioByClient(0, true).subscribe((res) => this.fillProductsCards(res, filter));
        break;
      case ProductTypes.PACK:
        this.productsService.getProductPacks(0, true).subscribe((res) => this.fillProductsCards(res, filter));
        break;
    }
  }

  fillProductsCards(srvResponse, filter): void {
    this.products = srvResponse.data;
    this.primaryFilter = filter;
    this.countProducts = srvResponse.pagination?.count || 0;
    this.infiniteContainer.nativeElement.scrollTop = 0;
  }

  cleanProductCards(filter): void {
    this.products = [];
    this.primaryFilter = filter;
    this.countProducts = 0;
  }

  addAllProductsToCart(): void {
    const products = [...this.products];
    this.store.dispatch(upsertMultipleProducts({ products }));
  }

  getMoreProductsScroll(): void {
    if (this.countProducts === this.products.length) return;
    switch (this.primaryFilter) {
      case ProductTypes.SUGGESTED:
        this.productsService.getSuggestedProducts(this.products.length, false, false).subscribe((res) => {
          this.countProducts = res.pagination.count;
          this.products.push(...res.data);
        });
        break;
      case ProductTypes.UNIT:
        this.productsService.getPortfolioByClient(this.products.length, false, this.productFilter).subscribe((res) => {
          this.countProducts = res.pagination.count;
          this.products.push(...res.data);
        });
        break;
    }
  }

  reSearchProducts(): void {
    this.getPortfolioFilters({ ...this.productFilter, text: '' });
    this.productsService.getPortfolioByClient(0, true, this.productFilter).subscribe((res) => {
      this.products = res.data;
      this.countProducts = 0;
    });
  }

  searchByText(): void {
    if (this.productFilter.text.match(RegexList.detectSpecialChar)) {
      setTimeout(() => {
        this.productFilter.text = this.productFilter.text.replace(RegexList.detectSpecialChar, '');
      }, 0);
    } else {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.reSearchProducts();
        this.gtmService.pushTag({ event: 'search', term: this.productFilter.text });
      }, 500);
    }
  }

  searchByReturnability(returnabilitySelected, disabled): void {
    if (disabled) return;

    if (this.productFilter.returnability === null) {
      this.productFilter.returnability = returnabilitySelected;
    } else if (this.productFilter.returnability === returnabilitySelected) {
      this.productFilter.returnability = null;
    } else {
      this.productFilter.returnability = returnabilitySelected;
    }
    this.reSearchProducts();
  }

  searchByCategory(category): void {
    const newcategory = this.productFilter.category === category ? '' : category;
    this.productFilter = { category: newcategory, text: this.productFilter.text, package: '', brand: '', size: '', returnability: null };
    this.reSearchProducts();
  }

  resetProductFilter(): void {
    this.productFilter = { package: '', brand: '', size: '', returnability: null, text: '' };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
