import { TestBed, inject } from '@angular/core/testing';

import { TextlayoutService } from './textlayout.service';

describe('TextlayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextlayoutService]
    });
  });

  it('should be created', inject([TextlayoutService], (service: TextlayoutService) => {
    expect(service).toBeTruthy();
  }));
});
