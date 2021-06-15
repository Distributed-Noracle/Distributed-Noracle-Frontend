import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateSpaceComponent } from './create-space.component';

describe('CreateSpaceComponent', () => {
  let component: CreateSpaceComponent;
  let fixture: ComponentFixture<CreateSpaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
