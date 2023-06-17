import { Component, Input, OnInit } from '@angular/core';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as MY_REQUESTS_ICONS from '@modules/common/model/status.model';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as MY_REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableActionModel, TableColumnSortModel, TableConfigModel, TableLinkCellModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalCommentComponent } from '@shared/modules/comment/components/modal-comment/modal-comment.component';
import { getPanelClasses } from '@shared/modules/modals/model/modals.model';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ArchiveDeleteComponent } from '@shared/components/archive-delete/archive-delete.component';


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
  public showDetails: boolean = false
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: 'addComment',
        label: 'Add Comment',
        icon: {
          isSVG: true,
          name: 'add_comment'
        },
        hideCondition: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
          return !record.isCommentable
        }
      },
      {
        key: SSAConfigInst.CRUD_CONFIG.actions.delete,
        label: SSAConfigInst.CRUD_CONFIG.actions.delete + ' & ' + SSAConfigInst.CRUD_CONFIG.actions.cancel,
        icon: {
          name: 'delete_outline',
        },
        hideCondition: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
          return !(record.requestStatus === MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress || (record.requestStatus === 'Applied' && (record.workflowType === 14 || record.workflowType === 12 || record.workflowType === 16) && record.workflowType < 18))
        }
      },
      {
        key: 'edit_request',
        label: 'Edit Request',
        icon: {
          name: 'edit'
        },
        hideCondition: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
          return !record.isEditable
        }
      }, {
        key: SSAConfigInst.CRUD_CONFIG.actions.view,
        label: SSAConfigInst.CRUD_CONFIG.actions.view + ' Details',
        icon: {
          name: 'visibility'
        }
      },

    ],


    keys: ['id', 'request_type', 'created_date', 'employee_candidate_name', 'details','request_status', 'actions'],
    columns: [
      {
        key: 'id',
        head: 'Request ID',
        hidden: false,
        dribbleColumnDisplay: true,
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
        dribbleColumnDisplay: true,
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
        dribbleColumnDisplay: true,
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

      // employee_candidate_name
      {
        key: 'employee_candidate_name',
        head: 'Employee/Candidate Name',
        hidden: false,
        dribbleColumnDisplay: true,
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
      //Details
      {
        key: 'details',
        head: 'Details',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
          // check if there is no Details, display lock icon
          // return this.showDetails ? record.details : `<span class="ml-3">&#128274</span>`},
          return this.showDetails ? record.details : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`},
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
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_REQUESTS_MODELS.MyRequestModel) => {
          return MY_REQUESTS_ICONS.REQUESTS_STATUSES_ICONS[record.requestStatus]
        },
        view: {
          width: 10,
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
  }




  public mapTableAction({ record, action }: { record: MY_REQUESTS_MODELS.MyRequestModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.delete) this._deleteRequest(record);
    else if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record);
    else if (action.key === 'edit_request') {
      if (record.workflowType === 25) this._router.navigateByUrl('/my-requests/edit-recruitment/' + record.id)
    }
    else if (action.key === 'addComment') {
      this._matDialog.open(ModalCommentComponent, {
        data: {
          record,
          commentMaxLength: 800
        },
        panelClass: getPanelClasses('ADD_COMMENT')
      })
      return;
    }
    else return;
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

  public toggleShowDetails(event){
    this.showDetails = event
  }

}
