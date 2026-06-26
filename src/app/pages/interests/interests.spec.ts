import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Interests } from './interests';

describe('Interests', () => {
  let component: Interests;
  let fixture: ComponentFixture<Interests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interests],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Interests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

