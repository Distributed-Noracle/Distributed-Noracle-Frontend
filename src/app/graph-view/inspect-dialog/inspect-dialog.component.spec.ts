import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectDialogComponent } from './inspect-dialog.component';

describe('InspectDialogComponent', () => {
  let component: InspectDialogComponent;
  let fixture: ComponentFixture<InspectDialogComponent>;

  beforeEach(async(() => {
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
