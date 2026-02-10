import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { Employee } from '../../model';
import { EmployeesHTTPService } from '../services/employeesHTTP.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDetailsResolver implements Resolve<Employee> {
  #employeeHTTP = inject(EmployeesHTTPService);

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = route.paramMap.get('id');
    if (!id) {
      throw new Error(':id route parameter required');
    }
    return this.#employeeHTTP.getEmployee(parseInt(id));
  }
}
