import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';
import { DiscretionaryDiscountService } from 'src/app/core/services/benefits.service';
import { ModalsService } from 'src/app/core/services/modals.service';
import { MyBenefitsComponent } from './my-benefits.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

const initialState = {
  client: {
    clientId: '001',
    organizationId: '124',
  },
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
  },
};

const validResponse = {
  httpStatus: 200,
  ok: true,
  code: 0,
  pagination: {
    limit: 40,
    offset: '0',
    count: 6,
    currentpage: 1,
  },
  data: [
    {
      discountId: 1333,
      validityTo: '2099-12-31T00:00:00.000Z',
      name: 'CCx3',
      detail: '15% en botellas 1.5lt. Coca Cola Zero',
      limitPrice: '999.000',
      active: 1,
      modifiedBy: 'Jose Prada',
      updatedTime: '2021-09-06T14:10:28.000Z',
    },
    {
      discountId: 1335,
      validityTo: '2099-12-31T00:00:00.000Z',
      name: 'SPx01',
      detail: 'Sprite a 500',
      limitPrice: '999.000',
      active: 1,
      modifiedBy: null,
      updatedTime: '2021-09-06T14:10:28.000Z',
    },
  ],
} as BERespModel;

describe('MyBenefitsComponent', () => {
  let component: MyBenefitsComponent;
  let fixture: ComponentFixture<MyBenefitsComponent>;
  let spyDiscretionaryDiscountService: jasmine.SpyObj<DiscretionaryDiscountService>;
  let spyModalService: jasmine.SpyObj<ModalsService>;

  beforeEach(async () => {
    spyDiscretionaryDiscountService = jasmine.createSpyObj<DiscretionaryDiscountService>('DiscretionaryDiscountService', ['getBenefitsClient']);
    spyModalService = jasmine.createSpyObj<ModalsService>('ModalsService', ['openConditionsModal']);
    spyDiscretionaryDiscountService.getBenefitsClient.and.returnValue(of(validResponse));

    await TestBed.configureTestingModule({
      declarations: [MyBenefitsComponent],
      imports: [ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: DiscretionaryDiscountService, useValue: spyDiscretionaryDiscountService },
        { provide: ModalsService, useValue: spyModalService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all discretionary discounts for client', () => {
    expect(spyDiscretionaryDiscountService.getBenefitsClient).toHaveBeenCalled();
    expect(component.discounts).toBe(validResponse.data);
  });

  it('should show a modal when clicked terms and conditions', () => {
    component.openDocModal();
    expect(spyModalService.openConditionsModal).toHaveBeenCalled();
  });
});
