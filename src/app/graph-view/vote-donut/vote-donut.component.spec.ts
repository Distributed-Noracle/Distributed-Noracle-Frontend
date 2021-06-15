import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VoteDonutComponent } from './vote-donut.component';

describe('VoteDonutComponent', () => {
  let component: VoteDonutComponent;
  let fixture: ComponentFixture<VoteDonutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteDonutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
