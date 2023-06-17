import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MY_TEAM_LEAVE_ACTIONS from '@modules/my-team-leaves/state/my-team-leave.actions';
import * as MY_TEAM_LEAVE_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';
import * as MY_TEAM_LEAVE_CONFIGS from '@modules/my-team-leaves/models/my-team-leave.config';
import * as MY_TEAM_LEAVE_ICONS_CONFIGS from '@modules/common/model/status.model';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Router } from '@angular/router';
import { SSAConfigInst } from 'src/app/config/app.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';

@Component({
  selector: 'ssa-table-my-teams-leave-requests',
  templateUrl: './table-my-teams-leave-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableMyTeamsLeaveRequestsComponent implements OnInit {
  @Input() public records$: Observable<MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  public tableConfig: TableConfigModel = {
    actions: [
      // {
      //   key: SSAConfigInst.CRUD_CONFIG.actions.view,
      //   label: SSAConfigInst.CRUD_CONFIG.actions.view + ' Details',
      //   icon: {
      //     name: 'visibility'
      //   }
      // }
    ],
    // keys: ['id', 'request_type', 'created_date', 'employee_name', 'request_status', 'actions'],
    keys: ['id', 'request_type', 'created_date', 'employee_name', 'request_status', 'current_assignee'],
    columns: [
      {
        key: 'id',
        head: 'Request ID',
        hidden: false,
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => {
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
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return MY_TEAM_LEAVE_CONFIGS.REQUEST_TYPES_CONFIG[record.workflowType] },
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
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return record.createdDate },
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
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return record.issuer?.fullName },
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
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return record.targetEmployee?.fullName ?? 'N/A' },
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
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return MY_TEAM_LEAVE_ICONS_CONFIGS.REQUESTS_STATUSES_ICONS[record.requestStatus] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => {
              let baseClass = 'font-medium';
              switch (record.requestStatus) {
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.inProgress:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.inProgress}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Applied:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Applied}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Rejected:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Rejected}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Archived:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Archived}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Deleted:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Deleted}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Expired:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Expired}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Failed:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Failed}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.Closed:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.Closed}`
                case MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM.FailedProbation:
                  return baseClass += ` ${MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUSES_COLORS.FailedProbation}`
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
        type: TableCellTypes.status,
        value: (record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) => { return record?.currentAssignees[0]?.fullName ?? 'N/A' },
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
  @Dispatch() public PaginateMyTeamLeaveRequests(pagination: PaginationConfigModel) { return new MY_TEAM_LEAVE_ACTIONS.PaginateMyTeamLeaveRequests(pagination) }
  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);

  }

  public mapTableAction({ record, action }: { record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) this._openRequestDetails(record)
    else return;
  }

  private _openRequestDetails(record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) {
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
