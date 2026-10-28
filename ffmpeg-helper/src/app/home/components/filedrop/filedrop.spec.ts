import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filedrop } from './filedrop';

describe('Filedrop', () => {
  let component: Filedrop;
  let fixture: ComponentFixture<Filedrop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filedrop],
    }).compileComponents();

    fixture = TestBed.createComponent(Filedrop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
