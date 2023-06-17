import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyTasksState, MyTasksStateModel } from '@modules/my-tasks/state/my-tasks.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as MY_TASKS_CONFIGS from '../../models/my-tasks.config';
import * as MY_TASKS_ACTIONS from '../../state/my-tasks.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as MY_TASKS_MODELS from '@modules/my-tasks/models/my-tasks.model';
import { SSAConfigInst } from 'src/app/config/app.config';
import { SuccessSnackbar } from '../../models/my-tasks.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'ssa-my-tasks',
  templateUrl: './my-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MyTasksComponent implements OnInit, OnDestroy, HeadRefresherType {
  @ViewSelectSnapshot(MyTasksState.searchQuery) public searchQuery: string;
  @Select(MyTasksState.myTasks) private myTasks$: Observable<MY_TASKS_MODELS.MyTasksModel[]>
  @ViewSelectSnapshot(MyTasksState.showDetails) public showDetails: boolean;
  public headInformation = {
    title: 'My Tasks'
  }
  // Filtration toggles
  public isSearchReset = false

  public multipleSelected: MY_TASKS_MODELS.MyTasksModel[] = [];
  public selectAllFlag: boolean = false;
  /*______________Request type filtration configs_________________*/
  public requestTypesOptions = SSAConfigInst.GetSortedRequestTypes();
  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Type',
    multiple: true,
    value: this._store.selectSnapshot(MyTasksState.filtration).types ?? []
  }

  /*_______________Task status filtration configs__________________*/

  public taskStatusOptions = MY_TASKS_CONFIGS.TASK_STATUS_OPTIONS;
  public taskStatusSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Task Status',
    multiple: false,
    value: this._store.selectSnapshot(MyTasksState.filtration).state ?? 0
  }

  public isMobile: boolean;
  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _snackbarService: SnackBarsService,

  ) {
    // if url has side-panel but doesn't include type in query param then we need to remove the sidepanel
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))) {
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
  }

  @Dispatch() public fireFilterMyTasksByTaskStatus(state: number) { return new MY_TASKS_ACTIONS.FilterMyTasks({ state }) }

  @Dispatch() public fireFilterMyTasksByRequestTypes(types: number[]) { return new MY_TASKS_ACTIONS.FilterMyTasks({ types }) }
  @Dispatch() public fireSearchMyTasksAction(searchQuery: string) { this.isSearchReset = false; return new MY_TASKS_ACTIONS.SearchMyTasks(searchQuery) }
  @Dispatch() private _fireGetMyTasks() { return new MY_TASKS_ACTIONS.GetMyTasks() }
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.refreshHeadInformation();
    this.myTasks$.subscribe(tasks => {
      if (tasks?.length) {
        this.multipleSelected = tasks.filter(task => task.checked);
      }
    })
  }


  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  public fireFilterByTypes(types: number[]) {
    if (types === null || types.length === 0) {
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig,
        value: null
      }
    }
    this.fireFilterMyTasksByRequestTypes(types)

  }

  public fireFilterByStatuses(state: number) {
    if (state === 0) {
      this.taskStatusSelectConfig = {
        ...this.taskStatusSelectConfig,
        value: state
      }
    }
    this.fireFilterMyTasksByTaskStatus(state)
  }


  public resetFiltration() {
    this._store.dispatch(new MY_TASKS_ACTIONS.ResetFiltration()).subscribe(res => {
      this.clearFiltration();

    })
  }

  public clearFiltration() {

    this.requestTypesSelectConfig = {
      ...this.requestTypesSelectConfig,
      value: this._store.selectSnapshot(MyTasksState.filtration).types ?? []
    }
    this.taskStatusSelectConfig = {
      ...this.taskStatusSelectConfig,
      value: this._store.selectSnapshot(MyTasksState.filtration).state ?? 0
    };
    this.isSearchReset = true;
  }

  public applyAction(button: any) {
    this.multipleSelected.map((row, i) => {
      const takeActionParameter: MY_TASKS_MODELS.ActionConfigsModel = {
        requestId: row.id,
        choice: button.identifier
      }
      this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionsOnTask(takeActionParameter)).subscribe(() => {
        if (i === this.multipleSelected.length - 1) {
          this._snackbarService.openSuccessSnackbar({
            message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
            duration: 5,
            showCloseBtn: false
          })
          this._fireGetMyTasks();
          this.multipleSelected = [];
        }
      })

    })
  }



  ngOnDestroy() {
    // this.fireSearchMyTasksAction(''); // That's because QA want us to not cache the search results whenever we navigate to another page
    this._store.dispatch(new StateOverwrite([MyTasksState, new MyTasksStateModel()]))

  }


}
