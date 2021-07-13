import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InspectDialogComponent } from './inspect-dialog.component';

describe('InspectDialogComponent', () => {
  let component: InspectDialogComponent;
  let fixture: ComponentFixture<InspectDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
