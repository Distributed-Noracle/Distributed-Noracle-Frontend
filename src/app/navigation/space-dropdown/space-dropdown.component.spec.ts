import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpaceDropdownComponent } from './space-dropdown.component';

describe('SpaceDropdownComponent', () => {
  let component: SpaceDropdownComponent;
  let fixture: ComponentFixture<SpaceDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
