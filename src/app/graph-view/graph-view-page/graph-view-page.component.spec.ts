import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GraphViewPageComponent } from './graph-view-page.component';

describe('GraphViewPageComponent', () => {
  let component: GraphViewPageComponent;
  let fixture: ComponentFixture<GraphViewPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
