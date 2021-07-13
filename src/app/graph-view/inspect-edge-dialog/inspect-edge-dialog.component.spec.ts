import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InspectEdgeDialogComponent } from './inspect-edge-dialog.component';

describe('InspectEdgeDialogComponent', () => {
  let component: InspectEdgeDialogComponent;
  let fixture: ComponentFixture<InspectEdgeDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectEdgeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectEdgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
