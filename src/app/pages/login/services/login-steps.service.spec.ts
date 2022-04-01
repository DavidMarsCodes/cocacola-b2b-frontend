import { TestBed } from '@angular/core/testing';

import { LoginStepsService } from './login-steps.service';

describe('LoginStepsService', () => {
  let service: LoginStepsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginStepsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
