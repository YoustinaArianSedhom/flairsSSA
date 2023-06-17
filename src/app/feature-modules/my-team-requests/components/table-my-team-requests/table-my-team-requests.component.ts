import { Component, Input, OnInit } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';
import * as MY_TEAM_REQUESTS_CONFIG from '@modules/my-team-requests/models/my-team-requests.config';
import * as MY_TEAM_ICONS_CONFIGS from '@modules/common/model/status.model';
import * as MY_TEAM_REQUESTS_ACTIONS from '@modules/my-team-requests/state/my-team-requests.actions';
import { Router } from '@angular/router';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
@Component({
  selector: 'ssa-table-my-team-requests',
  templateUrl: './table-my-team-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableMyTeamRequestsComponent implements OnInit {
  @Input() public records$: Observable<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['id', 'request_type', 'created_date', 'employee_name', 'request_status', 'current_assignee'],
    columns: [
      {
        key: 'id',
        head: 'Request ID',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => {
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
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return MY_TEAM_REQUESTS_CONFIG.REQUEST_TYPES_CONFIG[record.workflowType] },
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
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return record.createdDate },
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
        dribbleColumnDisplay: true,
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return record.issuer?.fullName },
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
        dribbleColumnDisplay: true,
        type: TableCellTypes.status,
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return record.targetEmployee?.fullName ?? 'N/A' },
        view: {
          width: 10,
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
        dribbleColumnDisplay: true,
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return MY_TEAM_ICONS_CONFIGS.REQUESTS_STATUSES_ICONS[record.requestStatus] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => {
              let baseClass = 'font-medium';
              switch (record.requestStatus) {
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.inProgress:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.inProgress}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Applied:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Applied}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Rejected:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Rejected}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Archived:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Archived}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Deleted:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Deleted}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Expired:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Expired}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Failed:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Failed}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.Closed:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.Closed}`
                case MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM.FailedProbation:
                  return baseClass += ` ${MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUSES_COLORS.FailedProbation}`
                default:
                  return baseClass;
              }

            }
          }
        },
        type: TableCellTypes.icon
      },
      // current_assignee
      {
        key: 'current_assignee',
        head: 'Assigned',
        hidden: false,
        dribbleColumnDisplay: true,
        type: TableCellTypes.status,
        value: (record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) => { return record?.currentAssignees[0]?.fullName ?? 'N/A' },
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
    ]
  }

  constructor(
    private _tablesService: TablesService,
    private _router: Router
  ) { }

  @Dispatch() public fireSortTable(sortConfig: TableColumnSortModel) { return new this.actions.sort(sortConfig) }
  @Dispatch() public PaginateMyTeamRequests(pagination: PaginationConfigModel) { return new MY_TEAM_REQUESTS_ACTIONS.PaginateMyTeamRequests(pagination) }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);


  }


  public mapTableAction({ record, action }: { record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record)
    else return;
  }

  private _openRequestDetails(record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) {
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
