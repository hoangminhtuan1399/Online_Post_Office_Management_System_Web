import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDeliveryPopoverComponent } from './track-delivery-popover.component';

describe('TrackDeliveryPopoverComponent', () => {
  let component: TrackDeliveryPopoverComponent;
  let fixture: ComponentFixture<TrackDeliveryPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackDeliveryPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDeliveryPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
