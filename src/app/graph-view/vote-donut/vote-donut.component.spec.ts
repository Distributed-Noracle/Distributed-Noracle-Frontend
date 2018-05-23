import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteDonutComponent } from './vote-donut.component';

describe('VoteDonutComponent', () => {
  let component: VoteDonutComponent;
  let fixture: ComponentFixture<VoteDonutComponent>;

  beforeEach(async(() => {
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
