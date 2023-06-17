import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MyTeamsTasksState, MyTeamsTasksStateModel } from '@modules/my-teams-tasks/state/my-teams-tasks.state';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_CONFIG from '@modules/my-teams-tasks/models/my-teams-tasks.config'
import * as MY_TEAMS_TASKS_ACTIONS from '@modules/my-teams-tasks/state/my-teams-tasks.action'
import { SSAConfigInst } from 'src/app/config/app.config';
@Component({
  selector: 'ssa-my-teams-tasks',
  templateUrl: './my-teams-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MyTeamsTasksComponent implements OnInit, OnDestroy {

  @ViewSelectSnapshot(MyTeamsTasksState.searchQuery) public searchQuery: string;
  public headInformation = {
    title: `My Team's Tasks`
  }
  public resetSearch = false

  public requestTypesOptions = SSAConfigInst.GetSortedRequestTypes();
  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Type',
    multiple: true,
    value: []
  }

  public taskStatusOptions = MY_TEAMS_TASKS_CONFIG.TASK_STATUS_OPTIONS;
  public taskStatusSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Task Status',
    multiple: false,
    value: 0
  }

  public isMobile: boolean;
  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,

  ) {
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))) {
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
  }

  @Dispatch() public fireSearchMyTasksAction(searchQuery: string) { return new MY_TEAMS_TASKS_ACTIONS.SearchMyTeamsTasks(searchQuery) }
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
  }

  public fireFilterByRequestTypes(value: number[]) {
    this._fireFilterMyTeamsTasks({ types: value })
  }

  public fireFilterByStatus(value: number) {
    this._fireFilterMyTeamsTasks({ state: value })
  }


  public resetFiltration() {
    this.resetSearch = !this.resetSearch;
    this.requestTypesSelectConfig = {
      placeholder: 'Request Type',
      multiple: true,
      value: []
    }
    this.taskStatusSelectConfig = {
      placeholder: 'Task Status',
      multiple: false,
      value: 0
    }
    this._fireResetFilters()
  }


  @Dispatch() private _fireResetFilters() { return new MY_TEAMS_TASKS_ACTIONS.ResetFiltration() }
  @Dispatch() private _fireFilterMyTeamsTasks(filtration: MY_TEAMS_TASKS_MODEL.MyTeamsTasksFiltrationModel) { return new MY_TEAMS_TASKS_ACTIONS.FilterMyTeamsTasks(filtration) }

  ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([MyTeamsTasksState, new MyTeamsTasksStateModel()]))
  }

}
