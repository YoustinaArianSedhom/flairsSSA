import { ViewAssigneesComponent } from './../view-assignees/view-assignees.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { MyTeamsTasksState } from '@modules/my-teams-tasks/state/my-teams-tasks.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable } from 'rxjs';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_CONFIG from '@modules/my-teams-tasks/models/my-teams-tasks.config'
import * as MY_TEAMS_TASKS_ACTIONS from '@modules/my-teams-tasks/state/my-teams-tasks.action'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Router } from '@angular/router';

@Component({
  selector: 'ssa-table-my-teams-tasks',
  templateUrl: './table-my-teams-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TableMyTeamsTasksComponent implements OnInit {

  @Select(MyTeamsTasksState.myTeamsTasks) public myTeamsTasks$: Observable<MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel[]>
  @ViewSelectSnapshot(MyTeamsTasksState.PaginateMyTeamsTasks) public pagination: PaginationConfigModel
  public showDetails: boolean = false

  @Dispatch() public firePaginateMyTeamsTasks(pagination: PaginationConfigModel) { return new MY_TEAMS_TASKS_ACTIONS.PaginateMyTeamsTasks(pagination) }
  @Dispatch() public fireSortMyTeamsTasksAction(sort: TableColumnSortModel) { return new MY_TEAMS_TASKS_ACTIONS.SortMyTeamsTasks(sort); }
  constructor(private _router: Router,
    private _dialog: MatDialog) { }

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['request', 'creation-date', 'assignees', 'creator-name', 'employee_candidate_name', 'last_action_date', 'last_action_by', 'details', 'task-name'],
    columns: [
      {
        key: 'request',
        head: 'Request',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => {
          return {
            key: SSAConfigInst.CRUD_CONFIG.actions.view,
            label: `${record.readableId} - ${MY_TEAMS_TASKS_CONFIG.REQUEST_TYPES_CONFIG[record.workflowType]}`
          }
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary'
          },
        },
        type: TableCellTypes.eventEmitter
      },
      {
        key: 'creation-date',
        head: 'Creation Date',
        sort: {
          sortField: 1,
          sortType: SSAConfigInst.CRUD_CONFIG.sort.asc,
          disableClear: true
        },
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.createdDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'assignees',
        head: 'Assignees',
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => ({
          key: record?.currentAssignees?.length > 1 ? 'view_assignees' : '',
          label: record?.currentAssignees?.length > 1 ? 'View Assignees' : record.currentAssignees[0].fullName
        }),
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => {
              let baseClass = 'underline cursor-pointer text-primary pr-5';
              if (record?.currentAssignees?.length > 1) {
                return baseClass
              }
            }
          },
        },
        type: TableCellTypes.eventEmitter
      },
      {
        key: 'creator-name',
        head: 'Creator Name',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.issuer?.fullName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'employee_candidate_name',
        head: 'Employee/Candidate Name',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.targetEmployee?.fullName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'last_action_date',
        head: 'Last Action Date',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.lastModifiedDate },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'last_action_by',
        head: 'Last Action By',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.lastModifiedBy },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => {
              return 'px-2'
            }

          },
        },
      },
      {
        key: 'details',
        head: 'Details',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { 
          return this.showDetails ? record.details : `<span color="warn" class="mat-icon notranslate mat-warn material-icons ml-3">lock</span>`},
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.html
      },
      {
        key: 'task-name',
        head: 'Task Name',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.taskName },
        extraInfoValue: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => { return record.taskNotes.note },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: " block text-center",
            extraInfoClasses: (record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) => {
              let baseClass = ' text-xs text-center my-1 px-1 block text-center'
              if (!record.taskNotes.priority) {
                return baseClass += ' text-gray-400'
              } else return baseClass += ' text-red-400'
            }
          },
        },
        type: TableCellTypes.extraInfo
      },
    ]
  }

  ngOnInit(): void {
    this._fireGetTeamsTasks()
  }

  mapTableAction({ record, action }: { record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) {
      return this._router.navigate([{
        outlets: { 'side-panel': ['request-details', record.id] }
      }], { queryParams: { type: record.workflowType } })
    }
    else if (action.key === 'view_assignees') {
      this._dialog.open(ViewAssigneesComponent, {
        data: record
      })
    }
  }

  public toggleShowDetails(event){
    this.showDetails = event
  }

  @Dispatch() private _fireGetTeamsTasks() { return new MY_TEAMS_TASKS_ACTIONS.GetMyTeamsTasks() }
}
