import { ArchiveDeleteComponent } from '@shared/components/archive-delete/archive-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Store } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';
import * as ALL_REQUESTS_CONFIG from '@modules/all-requests/models/all-requests.config';
import * as ALL_REQUESTS_ICONS from '@modules/common/model/status.model';
import * as ALL_REQUESTS_ACTIONS from '@modules/all-requests/state/all-requests.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AllRequestsState } from '../../state/all-requests.state';

@Component({
  selector: 'ssa-table-all-requests',
  templateUrl: './table-all-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableAllRequestsComponent implements OnInit {
  public showDetails: boolean = false
  @Input() public records$: Observable<ALL_REQUESTS_MODELS.AllRequestModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};

  public tableConfig: TableConfigModel = {
    actions: [{
      key: SSAConfigInst.CRUD_CONFIG.actions.archive,
      label: SSAConfigInst.CRUD_CONFIG.actions.archive,
      icon: {
        name: 'archive',
        isSVG: false
      },
      hideCondition: (record: ALL_REQUESTS_MODELS.AllRequestModel) => {
        return (record.requestStatus !== ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.inProgress)
      }
    },
     {
      key: SSAConfigInst.CRUD_CONFIG.actions.view,
      label: SSAConfigInst.CRUD_CONFIG.actions.view + ' Details',
      icon: {
        name: 'visibility'
      }
    },
     {
      key: SSAConfigInst.CRUD_CONFIG.actions.support,
      label: SSAConfigInst.CRUD_CONFIG.actions.support + ' Details',
      icon: {
        name: 'support',
        isSVG: true
      }
    },
  ],


    keys: ['id', 'request_type', 'created_date', 'creator_name', 'employee_candidate_name','details', 'request_status', 'actions'],
    columns: [
      {
        key: 'id',
        head: 'Request ID',
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => {
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
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => { return SSAConfigInst.REQUEST_TYPES_CONFIG[record.workflowType] },
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
        dribbleColumnDisplay: true,
        sort: {
          sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
          sortField: 1,
          disableClear: true
        },
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => { return record.createdDate },
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
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => { return record.issuer?.fullName },
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

      // employee_candidate_name
      {
        key: 'employee_candidate_name',
        head: 'Employee/Candidate Name',
        type: TableCellTypes.status,
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => { return record.targetEmployee?.fullName ?? 'N/A' },
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
      //Details
      {
        key: 'details',
        head: 'Details',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => { 
          return this.showDetails ? record.details : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`
         },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.html
      },
      // request_status
      {
        key: 'request_status',
        head: 'Request Status',
        dribbleColumnDisplay: true,
        value: (record: ALL_REQUESTS_MODELS.AllRequestModel) => {
          return ALL_REQUESTS_ICONS.REQUESTS_STATUSES_ICONS[record.requestStatus]

        },
        view: {
          width: 4,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: ALL_REQUESTS_MODELS.AllRequestModel) => {
              let baseClass = 'font-medium';
              switch (record.requestStatus) {
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.inProgress:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.inProgress}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Applied:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Applied}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Rejected:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Rejected}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Archived:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Archived}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Deleted:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Deleted}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Expired:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Expired}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Failed:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Failed}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.Closed:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.Closed}`
                case ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM.FailedProbation:
                  return baseClass += ` ${ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_COLORS.FailedProbation}`
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
    private _router: Router,
    private _matDialog: MatDialog) { }

  /* _____________________ Actions Fires ________________________*/
  @Dispatch() public firePaginateRequestsAction(pagination: PaginationConfigModel) { return new this.actions.paginate(pagination) }
  @Dispatch() public fireSortRequestsAction(sortConfig: TableColumnSortModel) { return new this.actions.sort(sortConfig); }





  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }


  public mapTableAction({ record, action }: { record: ALL_REQUESTS_MODELS.AllRequestModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.archive) this._archiveRequest(record);
    else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record)
    else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.support) this._openSupportRequestDetails(record)
    else return;
  }


  private _archiveRequest(record: ALL_REQUESTS_MODELS.AllRequestModel) {
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
        this._store.dispatch(new ALL_REQUESTS_ACTIONS.ArchiveRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.archived('Request-' + record.readableId),
        }))
      }
    })
  }


  private _openRequestDetails(record: ALL_REQUESTS_MODELS.AllRequestModel) {
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
  private _openSupportRequestDetails(record: ALL_REQUESTS_MODELS.AllRequestModel) {
    this._router.navigate([{
      outlets: {
        'side-panel': ['request-details','support', record.id],
        
      }
    }], {
      queryParams: {
        type: record.workflowType
      }
    })
  }

  public toggleShowDetails(event){
    this.showDetails = event
  }

}
