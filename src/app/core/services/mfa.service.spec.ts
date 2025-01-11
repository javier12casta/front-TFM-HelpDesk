/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MfaService } from './mfa.service';

describe('Service: Mfa', () => {
  let service: MfaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MfaService]
    });
    service = TestBed.inject(MfaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
