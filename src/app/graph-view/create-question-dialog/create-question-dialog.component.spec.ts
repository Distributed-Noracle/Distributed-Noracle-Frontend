import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateQuestionDialogComponent } from './create-question-dialog.component';

describe('CreateQuestionDialogComponent', () => {
  let component: CreateQuestionDialogComponent;
  let fixture: ComponentFixture<CreateQuestionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
