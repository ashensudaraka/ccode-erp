import { TestBed } from '@angular/core/testing';

import { CustomDateParserFormatterService } from './custom-date-parser-formatter.service';

describe('CustomDateParserFormatterService', () => {
  let service: CustomDateParserFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomDateParserFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
