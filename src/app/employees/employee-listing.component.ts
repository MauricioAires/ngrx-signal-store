import { Component, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { catchError, finalize, NEVER, Observable, tap } from 'rxjs';
import { Employee } from '../model';
import { EmployeesHTTPService } from './services/employeesHTTP.service';
import { NameAndTitlePipe } from './pipes/name-and-title.pipe';
import { FlagPipe } from './pipes/flag.pipe';
import { LoaderComponent } from '../loader.component';
import { EmployeesStore } from './stores/employee-store';
import { EmployeesFiltersComponent } from './components/employees-filters/employees-filters.component';

@Component({
  selector: 'employee-listing',
  standalone: true,
  imports: [
    RouterModule,
    // CommonModule, Can I import only Angular pipes or I import only CommonModule
    NameAndTitlePipe,
    FlagPipe,
    LoaderComponent,
    EmployeesFiltersComponent,
  ],
  // providers: [ EmployeesStore ],
  template: `
    <app-employees-filters />

    <button type="button" (click)="store.loadEmployees()">reload</button>
    @if(store.isLoading()) {
    <loader />

    } @if (store.items(); as employees) {
    <div>
      count: {{ store.count() }}
      <ul>
        @for (e of employees; track e) {
        <li>
          {{ e | nameAndTitle }} {{ e | flag }} (<a
            routerLink="/employees/{{ e.id }}"
            routerLinkActive="active"
            >details</a
          >)
        </li>
        }
      </ul>
    </div>
    }
  `,
  styles: [``],
})
export class EmployeeListingComponent {
  /**
   * Specialize service
   */
  /**
   *  Shared login and state across the components
   */
  protected store = inject(EmployeesStore);
}
