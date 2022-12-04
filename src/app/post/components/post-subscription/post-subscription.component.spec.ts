import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSubscriptionComponent } from './post-subscription.component';

describe('PostSubscriptionComponent', () => {
  let component: PostSubscriptionComponent;
  let fixture: ComponentFixture<PostSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSubscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
