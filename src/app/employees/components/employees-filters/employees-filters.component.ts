import { Component, inject } from '@angular/core';
import { EmployeesStore } from '../../stores/employee-store';

@Component({
  selector: 'app-employees-filters',
  standalone: true,
  imports: [],
  templateUrl: './employees-filters.component.html',
  styleUrl: './employees-filters.component.css',
})
export class EmployeesFiltersComponent {
  protected store = inject(EmployeesStore);

  protected updateName(e: Event): void {
    const newValue = (e.target as HTMLInputElement).value;

    this.store.updateFiltersName(newValue);
  }
  protected updateSalaryFrom(e: Event): void {
    const newValue = parseInt((e.target as HTMLInputElement).value);

    this.store.updateFiltersFrom({
      from: newValue,
    });
  }
  protected updateSalaryTo(e: Event): void {
    const newValue = parseInt((e.target as HTMLInputElement).value);

    this.store.updateFiltersFrom({
      to: newValue,
    });
  }
}
