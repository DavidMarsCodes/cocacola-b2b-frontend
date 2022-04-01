import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DiscretionaryDiscountService } from './benefits.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ToastrModule } from 'ngx-toastr';
import { BERespModel } from '../models/backend/BE-response.model';

// GoogleTagManagerService Fake
class FakeGoogleTagManagerService {
  pushTag = jasmine.createSpy();
}

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

const errorDiscretionaryDiscount = {
  httpStatus: 404,
  ok: false,
  code: 30,
  errorType: 'discretionary discounts error',
  message: 'discretionary discounts not found',
  data: '',
};

describe('DiscretionaryDiscountService', () => {
  let service: DiscretionaryDiscountService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    let store: MockStore;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
      providers: [provideMockStore({ initialState }), { provide: GoogleTagManagerService, useClass: FakeGoogleTagManagerService }],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
    service = TestBed.inject(DiscretionaryDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should bring client's discretionary discounts", (done: DoneFn) => {
    service.getBenefitsClient().subscribe((response) => {
      expect(response).toEqual(validResponse);
      done();
    });
    const testReq = httpTestingController.expectOne(
      '/test/v1/public/api/cpg/001/country/CL/clients/001/discounts/discretionary?cutoffDays=30&limit=40&offset=0'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(validResponse);
    httpTestingController.verify();
  });

  it('should return error', (done: DoneFn) => {
    service.getBenefitsClient().subscribe((response) => {
      expect(response).toEqual(errorDiscretionaryDiscount);
      done();
    });
    const testReq = httpTestingController.expectOne(
      '/test/v1/public/api/cpg/001/country/CL/clients/001/discounts/discretionary?cutoffDays=30&limit=40&offset=0'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(errorDiscretionaryDiscount);
    httpTestingController.verify();
  });
});
