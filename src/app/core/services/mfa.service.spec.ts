/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MfaService } from './mfa.service';

describe('Service: Mfa', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MfaService]
    });
  });

  it('should ...', inject([MfaService], (service: MfaService) => {
    expect(service).toBeTruthy();
  }));
});
