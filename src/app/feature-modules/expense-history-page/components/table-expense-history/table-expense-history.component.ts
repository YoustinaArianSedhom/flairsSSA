import { Component, Input, OnInit } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '../../../../shared/modules/tables/model/tables.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as EXPENSE_ACTIONS from '@modules/expense-history-page/state/expense-history.actions';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import * as MY_TEAM_ICONS_CONFIGS from '@modules/common/model/status.model';
import * as EXPENSE_HISTORY_CONFIGS from '@modules/expense-history-page/models/expense-history.config'
@Component({
  selector: 'ssa-table-expense-history',
  templateUrl: './table-expense-history.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableExpenseHistoryComponent implements OnInit {
  @Input() public records$: Observable<EXPENSE_MODELS.ExpenseModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['id', 'name', 'mail', 'manager_name', 'creation_date', 'due_date', 'expense_type', 'amount','task_name', 'request_status'],
    columns: [
      // Request Id
      {
        key: 'id',
        head: 'Request ID',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => {
          return {
            label: record.readableId,
            key: SSAConfigInst.CRUD_CONFIG.actions.view
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'underline text-primary cursor-pointer'
          },
        },
        type: TableCellTypes.eventEmitter
      },
      {
        key: 'name',
        head: 'Creator',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.issuer.fullName },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      // Email
      {
        key: 'mail',
        head: 'Email',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.issuer.organizationEmail },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.email
      },
      // Manager Name
      {
        key: 'manager_name',
        head: 'Creator’s manager',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.issuerManager.fullName },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      // creation date
      {
        key: 'creation_date',
        head: 'Creation Date',
        hidden: false,
        sort: {
          sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
          sortField: 1,
          disableClear: true
        },
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.createdDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      },
      // created_date
      {
        key: 'due_date',
        head: 'Due Date',
        hidden: false,

        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.dueDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      },
      // Expense Type
      {
        key: 'expense_type',
        head: 'Expense Type',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record?.expenseTypeName },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      // amount
      {
        key: 'amount',
        head: 'Amount',
        value(record: EXPENSE_MODELS.ExpenseModel) { return record.amount },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      //Task Name
      {
        key: 'task_name',
        head: 'Task Name',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return record.taskName },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: "block text-center",
          }
        }
      },
      // request_status
      {
        key: 'request_status',
        head: 'Request Status',
        hidden: false,
        value: (record: EXPENSE_MODELS.ExpenseModel) => { return MY_TEAM_ICONS_CONFIGS.REQUESTS_STATUSES_ICONS[record.requestStatus] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: EXPENSE_MODELS.ExpenseModel) => {
              let baseClass = 'font-medium';
              switch (record.requestStatus) {
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.inProgress:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.inProgress}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Applied:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Applied}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Rejected:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Rejected}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Archived:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Archived}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Deleted:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Deleted}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Expired:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Expired}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Failed:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Failed}`
                case EXPENSE_HISTORY_CONFIGS.REQUEST_STATUES_ENUM.Closed:
                  return baseClass += ` ${EXPENSE_HISTORY_CONFIGS.REQUEST_STATUSES_COLORS.Closed}`
                default:
                  return baseClass;
              }

            }
          }
        },
        type: TableCellTypes.icon
      },
    ]
  }

  constructor(
    private _tablesService: TablesService,
    private _router: Router
  ) { }

  @Dispatch() public PaginationAllExpenseRequests(pagination: PaginationConfigModel) { return new EXPENSE_ACTIONS.PaginateAllExpenseRequests(pagination) }
  @Dispatch() private _fireSortAllExpenseRequests(sortType: number) { return new EXPENSE_ACTIONS.SortAllExpenseRequests(sortType) }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public fireSortTable(sortConfig: TableColumnSortModel) {
    this._fireSortAllExpenseRequests(sortConfig.sortType)
  }

  public mapTableAction({ record, action }: { record: EXPENSE_MODELS.ExpenseModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record)
    else return;
  }

  private _openRequestDetails(record: EXPENSE_MODELS.ExpenseModel) {
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
