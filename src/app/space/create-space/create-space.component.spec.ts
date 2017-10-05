import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSpaceComponent } from './create-space.component';

describe('CreateSpaceComponent', () => {
  let component: CreateSpaceComponent;
  let fixture: ComponentFixture<CreateSpaceComponent>;

  beforeEach(async(() => {
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
