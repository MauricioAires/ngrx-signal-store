import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesFiltersComponent } from './employees-filters.component';

describe('EmployeesFiltersComponent', () => {
  let component: EmployeesFiltersComponent;
  let fixture: ComponentFixture<EmployeesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
