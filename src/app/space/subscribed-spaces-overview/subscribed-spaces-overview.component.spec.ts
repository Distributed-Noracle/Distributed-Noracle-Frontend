import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubscribedSpacesOverviewComponent } from './subscribed-spaces-overview.component';

describe('SubscribedSpacesOverviewComponent', () => {
  let component: SubscribedSpacesOverviewComponent;
  let fixture: ComponentFixture<SubscribedSpacesOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedSpacesOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedSpacesOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
