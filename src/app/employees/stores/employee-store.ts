import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Employee } from '../../model';
import { computed } from '@angular/core';
import { mockEmployees } from './employees.mock';
// import { produce } from 'immer';

type EmployeeStore = {
  loadedItems: Employee[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    name: string;
    salary: Record<'from' | 'to', number>;
  };
};

const initialState: EmployeeStore = {
  loadedItems: mockEmployees,
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
  withState(initialState),
  withComputed(({ loadedItems, filters }) => ({
    count: computed(() => {
      return loadedItems().length;
    }),
    items: computed(() => {
      let result = loadedItems();

      if (filters.name().length) {
        const search = filters.name().toLowerCase();

        result = result.filter((e) => {
          return (
            e.firstName.toLowerCase().includes(search) ||
            e.lastName.toLowerCase().includes(search)
          );
        });
      }

      if (filters.salary.from()) {
        result = result.filter((e) => e.salary >= filters.salary.from());
      }

      if (filters.salary.to()) {
        result = result.filter((e) => e.salary <= filters.salary.to());
      }

      return result;
    }),
  })),
  withMethods((store) => ({
    updateFiltersName(name: EmployeeStore['filters']['name']) {
      patchState(store, (state) => ({
        filters: {
          ...state.filters,
          name,
        },
      }));
    },
    updateFiltersFrom(value: Partial<EmployeeStore['filters']['salary']>) {
      // patchState(store, (state) => ({
      //   filters: {
      //     ...state.filters,
      //     salary: {
      //       ...state.filters.salary,
      //       ...value,
      //     },
      //   },
      // }));
      // patchState(store, (state) => produce(state, (draft) => {}));
    },
  }))
);

/**
 * SignalStore was created, and now I need to understand why this code was created...
 * - In addition, I need to evaluate its impact on the application
 * - Moreover, I need to check if it follows our architectural standards
 * - As a result, I need to review the related business rules
 * (besides (informal), and (repetitivo))
 */
