import { TestBed } from '@angular/core/testing';

import { VisitPlanService } from './visit-plan.service';

describe('VisitPlanService', () => {
  let service: VisitPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
