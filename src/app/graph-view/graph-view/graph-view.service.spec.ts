import { TestBed, inject } from '@angular/core/testing';

import { GraphViewService } from './graph-view.service';

describe('GraphViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphViewService]
    });
  });

  it('should be created', inject([GraphViewService], (service: GraphViewService) => {
    expect(service).toBeTruthy();
  }));
});
