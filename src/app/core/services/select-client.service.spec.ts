import { TestBed } from '@angular/core/testing';

import { SelectClientService } from './select-client.service';

describe('SelectClientService', () => {
  let service: SelectClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
