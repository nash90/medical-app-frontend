import { TestBed } from '@angular/core/testing';

import { DruginfoService } from './druginfo.service';

describe('DruginfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DruginfoService = TestBed.get(DruginfoService);
    expect(service).toBeTruthy();
  });
});
