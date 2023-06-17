import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';

export class GetAllExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Get All Expense Requests';
}
export class PaginateAllExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Paginate All Expense Requests';
   constructor(public pagination: PaginationConfigModel) { }
}


export class SortAllExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Sort All Expense Requests';
   constructor(public sortType: number) { }
}

export class FilterAllExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Filter All Expense Requests';
   constructor(public filtration: EXPENSE_MODELS.ExpenseFiltrationModel) { }
}

export class ResetFilterAllExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Reset Filter All Expense Requests';
}

export class ExportExpenseRequests {
   static readonly type = '[EXPENSE-HISTORY] Export Expense Requests';
}

export class GetAllManagers {
   static readonly type = '[EXPENSE-HISTORY] Get All Managers';
}
