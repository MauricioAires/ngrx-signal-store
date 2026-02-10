import { signalStore, withState } from '@ngrx/signals';
import { Employee } from '../../model';

type EmployeeStore = {
  items: Employee[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    name: string;
    salary: Record<'from' | 'to', number>;
  };
};

const initialState: EmployeeStore = {
  items: [],
  isLoading: false,
  error: null,
  filters: {
    name: '',
    salary: {
      from: 0,
      to: 10_000,
    },
  },
};

export const EmployeesStore = signalStore(
  // The first parameter is not a function, to be a configuration oject
  // {
  //   providedIn: 'root',
  // },
  withState(initialState)
);

/**
 * SignalStore was created, and now I need to understand why this code was created...
 * - In addition, I need to evaluate its impact on the application
 * - Moreover, I need to check if it follows our architectural standards
 * - As a result, I need to review the related business rules
 * (besides (informal), and (repetitivo))
 */
