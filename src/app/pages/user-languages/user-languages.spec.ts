import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UserLanguages } from './user-languages';

describe('UserLanguages', () => {
  let component: UserLanguages;
  let fixture: ComponentFixture<UserLanguages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLanguages],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserLanguages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

