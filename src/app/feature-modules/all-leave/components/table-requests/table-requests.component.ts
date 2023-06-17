import { Component, Input, OnInit } from '@angular/core';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as MY_REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import * as MY_REQUESTS_ICON_CONFIGS from '@modules/common/model/status.model';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as ALL_LEAVE_ACTIONS from '@modules/all-leave/state/actions/all-leave.actions';
import { ArchiveDeleteComponent } from '@shared/components/archive-delete/archive-delete.component';

type tableType = 'all' | 'my';
@Component({
  selector: 'ssa-table-requests',
  templateUrl: './table-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableRequestsComponent implements OnInit {



  @Input() public records$: Observable<MY_REQUESTS_MODELS.MyRequestModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  @Input() public tableType: tableType = 'my';

  public tableConfig: TableConfigModel = {
    actions: [{
      key: SSAConfigInst.CRUD_CONFIG.actions.archive,
      label: SSAConfigInst.CRUD_CONFIG.actions.archive,
      icon: {
        name: 'archive',
        isSVG: false
      },
      hideCondition: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
        return (record.requestStatus !== MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress) || this.tableType === 'my'
      }
    }, {
      key: SSAConfigInst.CRUD_CONFIG.actions.delete,
      label: SSAConfigInst.CRUD_CONFIG.actions.delete,
      icon: {
        name: 'delete_outline',
      },
      hideCondition: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
        return (record.requestStatus !== MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress) || this.tableType === 'all'
      }
    }, {
      key: SSAConfigInst.CRUD_CONFIG.actions.view,
      label: SSAConfigInst.CRUD_CONFIG.actions.view + ' Details',
      icon: {
        name: 'visibility'
      }
    }],


    keys: ['id', 'request_type', 'created_date', 'employee_name', 'request_status', 'actions'],
    columns: [
      {
        key: 'id',
        head: 'Request ID',
        hidden: false,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
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
      // request_type
      {
        key: 'request_type',
        head: 'Request Type',
        hidden: false,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => { return SSAConfigInst.REQUEST_TYPES_CONFIG[record.workflowType] },
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
      // created_date
      {
        key: 'created_date',
        head: 'Creation Date',
        hidden: false,
        sort: {
          sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
          sortField: 1,
          disableClear: true
        },
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => { return record.createdDate },
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

      //
      {
        key: 'creator_name',
        head: 'Creator Name',
        hidden: false,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => { return record.issuer?.fullName },
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

      // employee_name
      {
        key: 'employee_name',
        head: 'Employee Name',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => { return record.targetEmployee?.fullName ?? 'N/A' },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          }
        }
      },
      // request_status
      {
        key: 'request_status',
        head: 'Request Status',
        hidden: false,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => { return MY_REQUESTS_ICON_CONFIGS.REQUESTS_STATUSES_ICONS[record.requestStatus] },
        view: {
          width: 4,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
              let baseClass = 'font-medium';
              switch (record.requestStatus) {
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.inProgress}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Applied:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Applied}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Rejected:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Rejected}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Archived:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Archived}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Deleted:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Deleted}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Expired:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Expired}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Failed:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Failed}`
                case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.Closed:
                  return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.Closed}`
                  case MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.FailedProbation:
                    return baseClass += ` ${MY_REQUESTS_CONFIGS.REQUEST_STATUSES_COLORS.FailedProbation}`
                default:
                  return baseClass;
              }

            }
          }
        },
        type: TableCellTypes.icon
      }
    ]
  }

  constructor(
    private _tablesService: TablesService,
    private _modals: ModalsService,
    private _snackbars: SnackBarsService,
    private _store: Store,
    private _matDialog: MatDialog,
    private _router: Router) { }

    /* _____________________ Actions Fires ________________________*/
  @Dispatch() public firePaginateRequestsAction(pagination: PaginationConfigModel) { return new this.actions.paginate(pagination) }


  @Dispatch() public fireSortRequestsAction(sortConfig: TableColumnSortModel) {
    return new this.actions.sort(sortConfig);
  }



  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
    if (this.tableType === 'all') this._tablesService.includeColumn('creator_name', 3)
  }




  public mapTableAction({ record, action }: { record: MY_REQUESTS_MODELS.MyRequestModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.archive) this._archiveRequest(record);
    else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.delete) this._deleteRequest(record);
    else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record)
    else return;
  }


  private _archiveRequest(record: MY_REQUESTS_MODELS.MyRequestModel) {
    const getMatDialogData = this._matDialog.open(
      ArchiveDeleteComponent, {
      data: {
        action: 'Archive',
        record
      },
      panelClass: ['form-dialog--medium']
    }
    )
    getMatDialogData.afterClosed().subscribe((res) => {
      if (res?.choiceNote) {
        this._store.dispatch(new ALL_LEAVE_ACTIONS.ArchiveRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.archived('Request-' + record.readableId),
        }))
      }
    })
  }


  private _deleteRequest(record: MY_REQUESTS_MODELS.MyRequestModel) {
    const getMatDialogData = this._matDialog.open(
      ArchiveDeleteComponent, {
      data: {
        action: 'Delete',
        record
      },
      panelClass: ['form-dialog--medium']
    }
    )
    getMatDialogData.afterClosed().subscribe((res) => {
      if (res?.choiceNote) {
        this._store.dispatch(new MY_REQUESTS_ACTIONS.DeleteMyRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.deleted('Request-' + record.readableId),
        }))
      }
    })
  }



  private _openRequestDetails(record: MY_REQUESTS_MODELS.MyRequestModel) {
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
