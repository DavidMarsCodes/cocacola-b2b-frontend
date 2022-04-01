import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ClientDiscretionaryDiscount } from 'src/app/core/models/benefit.model';
import { Client } from 'src/app/core/models/client.model';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { ModalsService } from 'src/app/core/services/modals.service';

import { DiscretionaryDiscountService } from 'src/app/core/services/benefits.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import * as ClientActions from 'src/app/core/state/actions/client.actions';

@Component({
  selector: 'app-my-benefits',
  templateUrl: './my-benefits.component.html',
  styleUrls: ['./my-benefits.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyBenefitsComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  discounts: ClientDiscretionaryDiscount[] = [];
  selectedClient: Client;
  clients: Client[];
  loading: boolean;
  countryCode: CountryCodes;
  readonly ROOT_LANG = 'MY_BENEFITS.HOME.';

  displayedColumns: string[] = ['promos', 'benefits', 'action'];
  dataSource: MatTableDataSource<ClientDiscretionaryDiscount>;
  expandedElement: ClientDiscretionaryDiscount | null;

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.dataSource) this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private toastr: ToastrService,
    private store: Store<{ user: UserInfo; client: Client; homeStyle: any; userLocal: UserLocal; discounts: ClientDiscretionaryDiscount[] }>,
    private modalsService: ModalsService,
    private discretionaryDiscountService: DiscretionaryDiscountService,
    private paginator: MatPaginatorIntl,
    private translateService: TranslateService
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.clients = user.clients)));
    this.subscriptions.add(
      this.store.select('client').subscribe((client) => {
        this.selectedClient = client;
        this.discounts = client.data.discounts;
        this.discountsInMatTable();
      })
    );
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadPaginator();
    this.loadDiscretionaryDiscounts();
  }

  private loadDiscretionaryDiscounts(): void {
    this.discretionaryDiscountService.getBenefitsClient().subscribe(
      async (res) => {
        try {
          this.discounts = res.data;
          this.store.dispatch(ClientActions.loadDiscretionaryDiscount({ discounts: this.discounts }));
          this.loading = false;
          if (this.discounts.length > 0) this.discountsInMatTable();
        } catch (e) {
          this.toastr.error(this.translateService.instant(this.ROOT_LANG + 'BENEFITS_ERROR')?.split(','));
        }
      },
      (error) => this.toastr.error(this.translateService.instant(this.ROOT_LANG + 'BENEFITS_ERROR')?.split(','))
    );
  }

  private loadPaginator(): void {
    this.translateService.use(this.countryCode).subscribe(() => {
      this.paginator.itemsPerPageLabel = this.translateService.instant(this.ROOT_LANG + 'ITEMS_PER_PAGE_LABEL')?.split(',');
      this.paginator.nextPageLabel = this.translateService.instant(this.ROOT_LANG + 'NEXT_PAGE_LABEL')?.split(',');
      this.paginator.previousPageLabel = this.translateService.instant(this.ROOT_LANG + 'PREVIOUS_PAGE_LABEL')?.split(',');
      this.paginator.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        const separator = this.translateService.instant(this.ROOT_LANG + 'RANGE_LABEL')?.split(',');
        return `${startIndex + 1} - ${endIndex} ${separator} ${length}`;
      };
    });
  }

  discountsInMatTable(): void {
    this.dataSource = new MatTableDataSource(this.discounts);
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.sort;
  }

  openDocModal(): void {
    this.modalsService.openConditionsModal();
  }

  isMobile(): boolean {
    return screen.width < 992;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
