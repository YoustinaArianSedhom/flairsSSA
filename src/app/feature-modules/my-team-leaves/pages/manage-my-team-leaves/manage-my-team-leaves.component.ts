import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MY_TEAM_LEAVE_ACTIONS from '@modules/my-team-leaves/state/my-team-leave.actions'
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { MyTeamLeaveState } from '@modules/my-team-leaves/state/my-team-leave.state';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as MY_TEAM_LEAVE_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';
import * as MY_TEAM_LEAVE_CONFIG from '@modules/my-team-leaves/models/my-team-leave.config';
import { Select, Store } from '@ngxs/store';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { MyTeamLeaveRequestStateModel } from '@modules/my-team-leaves/state/my-team-leave.state';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'ssa-manage-my-team-leaves',
  templateUrl: './manage-my-team-leaves.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      h1{
        margin:0px;
      }
    `
  ]
})
export class ManageMyTeamLeavesComponent implements OnInit, OnDestroy {
  @ViewChild('dateRange') datePicker: MatDatepicker<Date>;
  @ViewSelectSnapshot(MyTeamLeaveState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(MyTeamLeaveState.pagination) public pagination: PaginationConfigModel;
  @Select(MyTeamLeaveState.allMyTeamLeaveRequests) public allMyTeamLeaveRequests$: Observable<MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel[]>
  public dateFilter = {
    from: '',
    to: ''
  }
  public tableActions = {
    paginate: MY_TEAM_LEAVE_ACTIONS.PaginateMyTeamLeaveRequests,
    sort: MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests
  }

  public headInformation: HeadInformationModel = {
    title: `My Team's Leave Requests`
  }
  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamLeaveState.filtration).types ?? []
  }
  public requestTypes = MY_TEAM_LEAVE_CONFIG.MY_TEAM_LEAVE_TYPES_LIST;

  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamLeaveState.filtration).states ?? []
  }
  public requestStatuses = MY_TEAM_LEAVE_CONFIG.MY_TEAM_LEAVE_STATUSES_LIST;
  public isSearchReset = false


  public isMobile: boolean;

  constructor(
    private _store: Store,
    private _breakpointsObserver: BreakpointObserver,
    private _headRefresher: HeadRefresherService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
  ) {
    // if url has side-panel but doesn't include type in query param then we need to remove the sidepanel
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))){
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
   }


  @Dispatch() public fireSearchMyTeamLeaveRequests(searchQuery: string) { this.isSearchReset = false; return new MY_TEAM_LEAVE_ACTIONS.SearchMyTeamLeaveRequests(searchQuery) }
  @Dispatch() public fireFilterMyTeamLeaveRequestsByTypes(types: number[]) { return new MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests({ types }) }
  @Dispatch() public fireFilterMyTeamLeaveRequestsByStates(states: number[]) { return new MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests({ states }) }
  @Dispatch() public fireFilterMyTeamLeaveRequestsByDate(date) { return new MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests({ ...date }) }
  @Dispatch() public ExportMyTeamLeaveRequests() { return new MY_TEAM_LEAVE_ACTIONS.ExportMyTeamLeaveRequests() }
  @Dispatch() private _fireGetMyTeamLeaveRequests() { return new MY_TEAM_LEAVE_ACTIONS.GetMyTeamLeaveRequests() }
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this._fireGetMyTeamLeaveRequests();
    this.refreshHeadInformation(this.headInformation);
    this.requestTypes = this.requestTypes.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
          return -1;
      }
      if (nameA > nameB) {
          return 1;
      }
      return 0;
  })

  }
  public onChangeToDate() {
    if (this.dateFilter.from && this.dateFilter.to) {
      const dateFilter = {
        from: new Date(this.dateFilter.from).toISOString(),
        to: new Date(this.dateFilter.to).toISOString()
      };
      this.fireFilterMyTeamLeaveRequestsByDate(dateFilter)
    }
  }

  public refreshHeadInformation(config: HeadInformationModel): void {
    this._headRefresher.refresh(config);
  }


  public resetFiltration() {
    this._store.dispatch(new MY_TEAM_LEAVE_ACTIONS.ResetFiltration()).subscribe(res => {
      this.clearFiltration();

    })
  }

  public fireFilterByTypes(types: number[]) {
    if (types === null || types.length === 0) {
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig, value: null
      }
    }
    this.fireFilterMyTeamLeaveRequestsByTypes(types)

  }
  public fireFilterByStatuses(states: number[]) {
    if (states.length === 0) {
      this.requestStatesSelectConfig = {
        ...this.requestStatesSelectConfig,
        value: states
      };
    }
    this.fireFilterMyTeamLeaveRequestsByStates(states)
  }
  public fireClearDateFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    const dateFilter = {
      from: null,
      to: null
    };
    this.fireFilterMyTeamLeaveRequestsByDate(dateFilter)
  }
  public clearFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    this.requestTypesSelectConfig = {
      ...this.requestTypesSelectConfig,
      value: this._store.selectSnapshot(MyTeamLeaveState.filtration).types ?? []
    }
    this.requestStatesSelectConfig = {
      ...this.requestStatesSelectConfig,
      value: this._store.selectSnapshot(MyTeamLeaveState.filtration).states ?? []
    };
    this.isSearchReset = true;
  }


  ngOnDestroy(): void {
    // reset state value to the initial one
    this._store.dispatch(new StateOverwrite([MyTeamLeaveState, new MyTeamLeaveRequestStateModel()]))
  }

}
