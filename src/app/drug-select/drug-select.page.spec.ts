import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSelectPage } from './drug-select.page';

describe('DrugSelectPage', () => {
  let component: DrugSelectPage;
  let fixture: ComponentFixture<DrugSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugSelectPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
