import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';
import * as EXPENSE_ACTIONS from './expense-history.actions'
import { ExpenseHistoryService } from '../models/expense-history.service';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class ExpenseStateModel {
   public allExpenses: EXPENSE_MODELS.ExpenseModel[];
   public pagination: PaginationConfigModel;
   public filtration: EXPENSE_MODELS.ExpenseFiltrationModel;
   public allManagers: EXPENSE_MODELS.ManagerModel[];

   constructor() {
      this.allExpenses = [];
      this.pagination = {
         pageNumber:0,
         pageSize: 10
      };
      this.filtration = {
         searchQuery: '',
         sortType: -1, 
         states: []
      }
      this.allManagers = [];
   }
}

@Injectable()
@State<ExpenseStateModel>({
   name: 'Expense_History',
   defaults: new ExpenseStateModel()
})

export class ExpenseState {
   constructor (private _mainService: ExpenseHistoryService) { }
   
   /* ________________________________________ Selectors ________________________________________*/
   @Selector() static allExpenses(state: ExpenseStateModel): EXPENSE_MODELS.ExpenseModel[] { return state.allExpenses };
   @Selector() static pagination(state: ExpenseStateModel): PaginationConfigModel { return { ...state.pagination } };
   @Selector() static searchQuery(state: ExpenseStateModel):string { return state.filtration.searchQuery}
   @Selector() static filtration(state: ExpenseStateModel): EXPENSE_MODELS.ExpenseFiltrationModel { return { ...state.filtration } }
   @Selector() static allManagers(state: ExpenseStateModel): EXPENSE_MODELS.ManagerModel[] { return state.allManagers  }

   /* ________________________________________ Actions ________________________________________*/

   @Action(EXPENSE_ACTIONS.GetAllExpenseRequests)
   public GetAllExpenseRequests({ patchState, getState }: StateContext<ExpenseStateModel>) {
      const { pagination: { pageNumber, pageSize }, filtration } = getState();
      return this._mainService.getAllExpenseRequests({ pageNumber, pageSize }, filtration).pipe(
         tap(({ records: allExpenses, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<EXPENSE_MODELS.ExpenseModel>) => patchState({
            allExpenses,
            pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
         }))
      )
   }

   @Action(EXPENSE_ACTIONS.PaginateAllExpenseRequests)
   public PaginateAllExpenseRequests({ patchState, dispatch }: StateContext<ExpenseStateModel>,{ pagination }: EXPENSE_ACTIONS.PaginateAllExpenseRequests){
      patchState({pagination});
      dispatch(new EXPENSE_ACTIONS.GetAllExpenseRequests())
   }

   @Action(EXPENSE_ACTIONS.SortAllExpenseRequests)
   public SortAllExpenseRequests({ getState, patchState, dispatch }: StateContext<ExpenseStateModel>, { sortType }: EXPENSE_ACTIONS.SortAllExpenseRequests) {
      patchState({
         filtration: {
            ...getState().filtration,
            sortType
         }
      })
      dispatch(new EXPENSE_ACTIONS.GetAllExpenseRequests())
   }

   @Action(EXPENSE_ACTIONS.FilterAllExpenseRequests)
   public FilterAllExpenseRequests({ patchState, getState, dispatch }: StateContext<ExpenseStateModel>, { filtration }: EXPENSE_ACTIONS.FilterAllExpenseRequests) {
      patchState({
         filtration: { ...getState().filtration, ...filtration },
         pagination: { ...getState().pagination, pageNumber: 0 }
      })
      dispatch(new EXPENSE_ACTIONS.GetAllExpenseRequests());
   }

   @Action(EXPENSE_ACTIONS.ResetFilterAllExpenseRequests)
   public ResetFilterAllExpenseRequests({ patchState, dispatch }: StateContext<ExpenseStateModel>) {
      patchState({
         pagination: {
            pageNumber: 0,
            pageSize: 10
         },
         filtration: {
            searchQuery: '',
            sortType: -1,
            states: [],
         }
      })
      dispatch(new EXPENSE_ACTIONS.GetAllExpenseRequests());
   }

   @Action(EXPENSE_ACTIONS.ExportExpenseRequests)
   public ExportExpenseRequests({ getState }: StateContext<ExpenseStateModel>) {
      const filtration = getState().filtration;
      return this._mainService.exportExpenseRequests(filtration).pipe(tap((res) => {
         downloadFile(res.body, `Expense History.xlsx`, res.body.type)
      }))
   }

   @Action(EXPENSE_ACTIONS.GetAllManagers)
   public GetAllManagers({patchState}: StateContext<ExpenseStateModel>){
      return this._mainService.searchManagers().pipe(tap(
         (allManagers:EXPENSE_MODELS.ManagerModel[])=> patchState({allManagers})
      ))
   }
}
