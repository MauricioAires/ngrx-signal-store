import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Employee } from '../../model';
import { computed, inject } from '@angular/core';
// import { mockEmployees } from './employees.mock'; // Not used, any more
import { produce } from 'immer';
import { LoggerService } from '../services/logger.service';
import { EmployeesHTTPService } from '../services/employeesHTTP.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
type EmployeeStore = {
  _loadedItems: Employee[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    name: string;
    salary: Record<'from' | 'to', number>;
  };
};

/**
 * The underscore (_) character says that the property is
 * visible only in the store.
 */

const initialState: EmployeeStore = {
  // _loadedItems: mockEmployees,
  _loadedItems: [],
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
  withComputed(({ _loadedItems, filters }) => ({
    count: computed(() => {
      return _loadedItems().length;
    }),
    items: computed(() => {
      let result = _loadedItems();

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
  withMethods((store, logger = inject(LoggerService)) => ({
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
      patchState(
        store,
        (state) =>
          produce(state, (draft) => {
            Object.assign(draft.filters.salary, value);
          })

        // checkout ngrx-immer package
      );
    },
    clearFilters() {
      logger.logMessage('clear started');
      patchState(
        store,
        (state) => ({
          filters: {
            ...state.filters,
            name: '',
          },
        }),
        (state) => ({
          filters: {
            ...state.filters,
            salary: {
              from: 0,
              to: 10_000,
            },
          },
        })
      );

      logger.logMessage('clear finished');
    },
  })),
  withMethods((store) => ({})),
  withMethods((store, employeesHTTP = inject(EmployeesHTTPService)) => ({
    /**
     * 1. all things rxjs operators
     * 2. IMPERATIVELY: value
     * 3. REACTIVE: signal, stream
     * really powerfully method
     */
    loadEmployees: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
            error: null,
            _loadedItems: [],
          });
        }), // Loading
        switchMap(() => employeesHTTP.getEmployees()),
        tap({
          next(items) {
            patchState(store, {
              _loadedItems: items,
              isLoading: false,
              error: null,
            });
          },
          error(error) {
            patchState(store, {
              isLoading: false,
              error,
              _loadedItems: [],
            });
          },
        })
      )
    ),
  }))
);

/**
 * Can create many groups of the function withMethods or
 * withComputed and group de function, for example
 * function about HTTP request or function just about
 * data manipulation
 */

/**
 * SignalStore was created, and now I need to understand why this code was created...
 * - In addition, I need to evaluate its impact on the application
 * - Moreover, I need to check if it follows our architectural standards
 * - As a result, I need to review the related business rules
 * (besides (informal), and (repetitivo))
 */
