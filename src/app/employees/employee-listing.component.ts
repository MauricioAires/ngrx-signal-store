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

@Component({
  selector: 'employee-listing',
  standalone: true,
  imports: [
    RouterModule,
    // CommonModule, Can I import only Angular pipes or I import only CommonModule
    NameAndTitlePipe,
    FlagPipe,
    LoaderComponent,
    JsonPipe,
  ],
  // providers: [ EmployeesStore ],
  template: `
    <input
      type="text"
      name=""
      id=""
      placeholder="name search"
      [value]="store.filters.name()"
      (input)="updateName($event)"
    />

    <input
      type="number"
      name=""
      id=""
      step="1000"
      placeholder="salary from"
      [value]="store.filters.salary.from()"
      (input)="updateSalaryFrom($event)"
    />

    <input
      type="number"
      name=""
      id=""
      step="1000"
      placeholder="salary to"
      [value]="store.filters.salary.to()"
      (input)="updateSalaryTo($event)"
    />

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

  // employees$!: Observable<Employee[]>;
  // #employeeHTTP = inject(EmployeesHTTPService);

  // isLoading = true;
  // error: Error | null = null;

  // ngOnInit() {
  //   this.employees$ = this.#employeeHTTP.getEmployees().pipe(
  //     tap(() => {
  //       this.error = null;
  //       this.isLoading = true;
  //     }),
  //     finalize(() => {
  //       this.isLoading = false;
  //     }),
  //     catchError((err) => {
  //       this.error = err;
  //       return NEVER;
  //     })
  //   );
  //   // this.employees$ = this.employeeHTTP.getEmployees({ nationality: "PL" })
  //   // this.employees$ = this.employeeHTTP.getEmployees({ office_like: "Poland" })
  //   // this.employees$ = this.employeeHTTP.getEmployees({ office_like: "Łódź" })
  // }
}
