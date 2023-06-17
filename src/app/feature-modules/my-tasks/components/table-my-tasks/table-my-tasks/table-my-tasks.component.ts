import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableColumnSortModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_TASKS_MODELS from '@modules/my-tasks/models/my-tasks.model';
import * as MY_TASKS_ICONS_CONFIGS from '@modules/common/model/status.model';
import * as MY_TASKS_ACTIONS from '@modules/my-tasks/state/my-tasks.actions'
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { MyTasksState } from '@modules/my-tasks/state/my-tasks.state';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Router } from '@angular/router';
import { MyTasksService } from '@modules/my-tasks/models/my-tasks.service';
import { InjectableFormComponent } from '../../injectable-form/injectable-form.component';
import { SuccessSnackbar } from '@modules/my-tasks/models/my-tasks.config';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { getPanelClasses } from '@shared/modules/modals/model/modals.model';
import { ModalCommentComponent } from '@shared/modules/comment/components/modal-comment/modal-comment.component';

@Component({
  selector: 'ssa-table-my-tasks',
  templateUrl: './table-my-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      ::ng-deep.iconBtn{
        margin: 0px 5px;
      }
    `
  ]
})
export class TableMyTasksComponent implements OnInit {


  @Select(MyTasksState.myTasks) public myTasks$: Observable<MY_TASKS_MODELS.MyTasksModel[]>
  @ViewSelectSnapshot(MyTasksState.paginationConfig) public pagination: PaginationConfigModel
  @ViewSelectSnapshot(MyTasksState.myTasks) public myTasks: MY_TASKS_MODELS.MyTasksModel[];
  @ViewSelectSnapshot(AuthorizationState.isWorkflowManagement) isWorkflowManager: boolean;
  @Select(MyTasksState.filtrationState) public filtrationState$: Observable<number>;
  @Select(MyTasksState.filtration) public filtration$: Observable<MY_TASKS_MODELS.MyTasksFiltrationModel>
  public showDetails: boolean = false

  public allSelected: boolean = false;

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/

  public tableConfig: TableConfigModel = {
    actions: (record: MY_TASKS_MODELS.MyTasksModel) => {
      let actions = [];
      if (record.availableChoices) {
        actions = record.availableChoices.map((action) => {
          return {
            key: action.identifier,
            label: action.displayName,
            icon: {
              name: action.icon,
              isSVG: false
            },
            active: action.displayName.includes('_'),
            toolTipHint: action.note,
            hideCondition: (record) => action.displayName.includes('NO_RESPONSE')
          }
        })
      }
      actions.push({
        key: SSAConfigInst.CRUD_CONFIG.actions.view,
        label: 'View',
        icon: {
          isSVG: false,
          name: 'visibility'
        },

      });
      if(record?.isCommentable){
        actions.unshift({
          key: 'addComment',
          label: 'Add Comment',
          icon: {
            isSVG: true,
            name: 'add_comment'
          },
  
        });
      }
      return actions
    },
    keys: ['checkbox', 'request', 'creation-date', 'creator-name', 'employee_candidate_name', 'task-status', 'last_action_date','last_action_by','details','task-name', 'actions'],
    columns: [
      {
        key: 'checkbox',
        head: 'all',
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return { label: record.taskName, checked: record?.checked } },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        // disabled: (record: MY_TASKS_MODELS.MyTasksModel) => { return record?.availableChoices && !(record.taskName === 'Pending Finance Action' && record?.availableChoices[0].type === 1) },
        disabled: (record: MY_TASKS_MODELS.MyTasksModel) => { return this.checkboxStatus(record) },
        hidden: false,
        dribbleColumnDisplay: false,
        type: TableCellTypes.checkbox
      },
      {
        key: 'request',
        head: 'Request',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TASKS_MODELS.MyTasksModel) => {
          return {
            key: SSAConfigInst.CRUD_CONFIG.actions.view,
            label: `${record.readableId} - ${SSAConfigInst.REQUEST_TYPES_CONFIG[record.workflowType]}`
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
      // {
      //   key: 'request-type',
      //   head: 'Request Type',
      //   hidden: false,
      //   value: (record: MY_TASKS_MODELS.MyTasksModel) => { return MY_TASKS_CONFIGS.REQUEST_TYPES_CONFIG[record.workflowType] },
      //   view: {
      //     width: 10,
      //     headCell: {
      //       align: TableCellAligns.start
      //     },
      //     bodyCell: {
      //       align: TableCellAligns.start
      //     },
      //   }

      // },
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
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.createdDate },
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
        key: 'creator-name',
        head: 'Creator Name',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.issuer?.fullName },
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
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.targetEmployee?.fullName },
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
        key: 'task-status',
        head: 'My Action',
        hidden: false,
        dribbleColumnDisplay: false,
        value: (record: MY_TASKS_MODELS.MyTasksModel) => {
          return
        },

        extraInfoValue: (record: MY_TASKS_MODELS.MyTasksModel) => {
          if (record.taskStatus === 'Done') {
            return record.submittedChoice.action
          }
          else return
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            extraInfoClasses: (record: MY_TASKS_MODELS.MyTasksModel) => {
              let baseClass = `text-xs font-medium text-white px-1 rounded `
              return baseClass += record.submittedChoice?.cssClass
            }
          },
        },
        type: TableCellTypes.extraInfo
      },
      {
        key: 'last_action_date',
        head: 'Last Action Date',
        hidden: false,
        dribbleColumnDisplay: true,
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.lastModifiedDate },
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
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.lastModifiedBy },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: MY_TASKS_MODELS.MyTasksModel)=>{
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
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { 
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
        value: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.taskName },
        extraInfoValue: (record: MY_TASKS_MODELS.MyTasksModel) => { return record.taskNotes.note },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: " block text-center",
            extraInfoClasses: (record: MY_TASKS_MODELS.MyTasksModel) => {
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
  /*_______________________________________SETUP Component CONFIG_________________________________*/
  private _multipleSelectedRecords: MY_TASKS_MODELS.MyTasksModel[] = [];


  constructor(
    private _tableService: TablesService,
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private _myTasksService: MyTasksService,
    private _matDialog: MatDialog,
  ) { }

  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/
  @Dispatch() public firePaginateMyTasks(pagination: PaginationConfigModel) { return new MY_TASKS_ACTIONS.PaginateMyTasks(pagination) }

  @Dispatch() public fireSortTasksAction(sort: TableColumnSortModel) {
    return new MY_TASKS_ACTIONS.SortMyTasks(sort);
  }
  @Dispatch() private _fireMyTasksTable() { return new MY_TASKS_ACTIONS.GetMyTasks() }

  @Dispatch() private _fireSelectTask(task: MY_TASKS_MODELS.MyTasksModel, checked: any) { return new MY_TASKS_ACTIONS.SelectTask(task, checked) }
  @Dispatch() private _fireSelectAllTasks(checked: any) { return new MY_TASKS_ACTIONS.SelectAllTasks( checked) }
  /*__________________________________________TABLE INITIATION____________________________________*/

  ngOnInit(): void {
    this._tableService.setupConfig(this.tableConfig);
    this._fireMyTasksTable();
    this.checkTaskStatus();
    this.checkSelectMultipleDisplay();
  }



  mapTableAction({ record, action }: { record: MY_TASKS_MODELS.MyTasksModel, action: TableActionModel }) {
    if (action.key === SSAConfigInst.CRUD_CONFIG.actions.view) {
      return this._router.navigate([{
        outlets: { 'side-panel': ['request-details', record.id] }
      }], { queryParams: { type: record.workflowType } })
    }
    if (action.key === 'checkbox') {
      this._fireSelectTask(record, action.label)
      return;
    }
    if (action.key === 'addComment') {
      console.log('open comment component');
      this._matDialog.open(ModalCommentComponent,{
        data: {
          record,
          commentMaxLength: 800
        },
        panelClass: getPanelClasses('ADD_COMMENT')
      })
      return;
    }





    const takeActionParameter: MY_TASKS_MODELS.ActionConfigsModel = {
      requestId: record.id,
      choice: action.key
    }

    this._myTasksService.getInjectableComponents(takeActionParameter).subscribe(
      (res: MY_TASKS_MODELS.InjectableDataModel[]) => {
        if (!res.length) {
          this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionOnTask(takeActionParameter)).subscribe(() => {
            this._snackbarService.openSuccessSnackbar({
              message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
              duration: 5,
              showCloseBtn: false
            })
          })
          return;
        }

        this._matDialog.open(InjectableFormComponent, {
          data: {
            action: action.key,
            record,
            injectedFields: res
          },
          panelClass: getPanelClasses(action.key)
        })
      }
    )

  }

  public checkboxStatus(record: MY_TASKS_MODELS.MyTasksModel): boolean {
    if (record?.availableChoices) {
      if (record.workflowType === 19 || record.workflowType === 20 || record.workflowType === 4)
        return !((record?.currentStateType === 15 || record?.currentStateType === 17 || record?.currentStateType === 46));
      if (record.workflowType === 9)
        return !(( record.currentStateType === 54 || record.currentStateType === 59 || record.currentStateType === 53))
      if (record.workflowType === 21)
      return !(( record.currentStateType === 99))
      if (record.workflowType === 26)
      return !(( record.currentStateType === 165 || record.currentStateType === 158))

    }
    return true
  }

  public displayCheckbox(filtration): boolean {
    return filtration.types.includes(19) || filtration.types.includes(20) || filtration.types.includes(4) || filtration.types.includes(9) || filtration.types.includes(21)|| filtration.types.includes(26)
  }

  public checkSelectMultipleDisplay() {
    this.filtration$.subscribe(filtration => {
      this._tableService.excludeColumn('checkbox');
      this.tableConfig.columns.find(item=> item.key==='checkbox').dribbleColumnDisplay = false
      if (filtration.state === 0 && filtration?.types?.length === 1 && this.displayCheckbox(filtration)) {
        this._tableService.includeColumn('checkbox', 0);
        this.tableConfig.columns.find(item=> item.key==='checkbox').dribbleColumnDisplay = true;
      }
    })

    this.myTasks$.subscribe((tasks) => {
      if (tasks) {
        const selectedTasks = []
        const allMultiCheckTasks = []
        tasks.map(task => {
          if (task.checked)
            selectedTasks.push(task)
          if (!this.checkboxStatus(task)) {
            allMultiCheckTasks.push(task)
          }
        });
        this.allSelected = false
        if (allMultiCheckTasks.length !== 0 && allMultiCheckTasks.length === selectedTasks.length) {
          this.allSelected = true
        } else {
          this.allSelected = false
        }
      }

    })
  }

  public fireSelectAll(checked: boolean) {
    this._fireSelectAllTasks(checked);
    
    // if (this._multipleSelectedRecords.length) {
    //   const record: MY_TASKS_MODELS.MyTasksModel = this._multipleSelectedRecords[0];
    //   this._fireSelectAllTasks(record, checked);
    // } else {
    //   this._fireSelectAllTasks(null, checked);
    // }

  }

  private checkTaskStatus() {
    this.filtrationState$.subscribe(
      (data) => {
        this._tableService.excludeColumn('task-status')
        this.tableConfig.columns.find(item=> item.key==='task-status').dribbleColumnDisplay = false
        if (data !== 0) {
          this._tableService.includeColumn('task-status', 5)
          this.tableConfig.columns.find(item=> item.key==='task-status').dribbleColumnDisplay = true
        }
      }
    )

  }

  public toggleShowDetails(event){
    this.showDetails = event
  }


}
