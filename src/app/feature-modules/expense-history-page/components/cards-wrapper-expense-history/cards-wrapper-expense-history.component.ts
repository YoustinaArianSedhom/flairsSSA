import { Component, Input, OnInit } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as EXPENSE_ACTIONS from '@modules/expense-history-page/state/expense-history.actions';

@Component({
  selector: 'ssa-cards-wrapper-expense-history',
  templateUrl: './cards-wrapper-expense-history.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardsWrapperExpenseHistoryComponent{
  @Input() public records$: Observable<EXPENSE_MODELS.ExpenseModel[]>;
  @Input() public pagination: PaginationConfigModel;
  constructor() { }

  @Dispatch() public firePaginate(pagination: PaginationConfigModel) { return new EXPENSE_ACTIONS.PaginateAllExpenseRequests(pagination)}

}
