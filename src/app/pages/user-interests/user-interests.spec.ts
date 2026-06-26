import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UserInterests } from './user-interests';

describe('UserInterests', () => {
  let component: UserInterests;
  let fixture: ComponentFixture<UserInterests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInterests],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInterests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

