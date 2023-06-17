import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';

@Component({
  selector: 'ssa-expense-history-card',
  templateUrl: './expense-history-card.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ExpenseHistoryCardComponent {
  @Input() public record: EXPENSE_MODELS.ExpenseModel;
  @Input() public pagination: PaginationConfigModel;
  constructor(private _router: Router) { }

  openRequestDetails(record: EXPENSE_MODELS.ExpenseModel) {
    this._router.navigate([{
      outlets: {
        'side-panel': ['request-details', record.id],
      }
    }], {
      queryParams: {
        type: record.workflowType
      }
    })
  }


}
