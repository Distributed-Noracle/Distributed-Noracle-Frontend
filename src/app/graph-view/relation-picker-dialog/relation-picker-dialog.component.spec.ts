import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RelationPickerDialogComponent } from './relation-picker-dialog.component';

describe('RelationPickerDialogComponent', () => {
  let component: RelationPickerDialogComponent;
  let fixture: ComponentFixture<RelationPickerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationPickerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
