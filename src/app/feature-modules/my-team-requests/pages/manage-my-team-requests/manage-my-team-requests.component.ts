import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { MyTeamRequestsState, MyTeamRequestsStateModel } from '../../state/my-team-requests.state';
import { Location } from '@angular/common';
import * as MY_TEAM_REQUESTS_CONFIG from '@modules/my-team-requests/models/my-team-requests.config'
import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';
import * as MY_TEAM_REQUESTS_ACTIONS from '@modules/my-team-requests/state/my-team-requests.actions'
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'ssa-manage-my-team-requests',
  templateUrl: './manage-my-team-requests.component.html',
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
export class ManageMyTeamRequestsComponent implements OnInit, OnDestroy {
  @ViewChild('dateRange') datePicker: MatDatepicker<Date>;
  @ViewSelectSnapshot(MyTeamRequestsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(MyTeamRequestsState.pagination) public pagination: PaginationConfigModel;
  @Select(MyTeamRequestsState.allMyTeamRequests) public allMyTeamRequests$: Observable<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel[]>
  public dateFilter = {
    from: '',
    to: ''
  }

  public tableActions = {
    paginate: MY_TEAM_REQUESTS_ACTIONS.PaginateMyTeamRequests,
    sort: MY_TEAM_REQUESTS_ACTIONS.SortMyTeamRequests
  }
  // ----------------

  public headInformation: HeadInformationModel = {
    title: `My Team's Requests`
  }
  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamRequestsState.filtration).types ?? []
  }
  public requestTypes = MY_TEAM_REQUESTS_CONFIG.MY_TEAM_REQUESTS_TYPES_LIST;

  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamRequestsState.filtration).states ??[]
  }
  public requestStatuses = MY_TEAM_REQUESTS_CONFIG.MY_TEAM_REQUESTS_STATUSES_LIST;
  public isSearchReset = false


  public isMobile: boolean;

  //------------------

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

  @Dispatch() public fireSearchMyTeamRequests(searchQuery: string) { this.isSearchReset = false; return new MY_TEAM_REQUESTS_ACTIONS.SearchMyTeamRequests(searchQuery) }
  @Dispatch() public fireFilterMyTeamRequestsByTypes(types: number[]) { return new MY_TEAM_REQUESTS_ACTIONS.FilterMyTeamRequests({ types }) }
  @Dispatch() public fireFilterMyTeamRequestsByStates(states: number[]) { return new MY_TEAM_REQUESTS_ACTIONS.FilterMyTeamRequests({ states }) }
  @Dispatch() public fireFilterMyTeamRequestsByDate(date) { return new MY_TEAM_REQUESTS_ACTIONS.FilterMyTeamRequests({ ...date }) }
  @Dispatch() private _fireGetMyTeamRequests() { return new MY_TEAM_REQUESTS_ACTIONS.GetMyTeamRequests() }
  
  
  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this._fireGetMyTeamRequests();
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
        from: moment(this.dateFilter.from).format('YYYY-MM-DD'),
        to: moment(this.dateFilter.to).format('YYYY-MM-DD')
      };
      this.fireFilterMyTeamRequestsByDate(dateFilter)
    }
  }
  public refreshHeadInformation(config: HeadInformationModel): void {
    this._headRefresher.refresh(config);
  }


  public resetFiltration() {
    this._store.dispatch(new MY_TEAM_REQUESTS_ACTIONS.ResetFiltration()).subscribe(res => {
      this.clearFiltration();

    })
  }

  public exportMyTeamRequest(){
    this._store.dispatch(MY_TEAM_REQUESTS_ACTIONS.ExportMyTeamRequests).subscribe(()=>{}, async (error) => {
      const message = JSON.parse(await error.error.text()).errorMessage;
      this._snackbarService.openFailureSnackbar({
        message,
        duration: 5,
        showCloseBtn: false
      });
    })
  }

  public fireFilterByTypes(types: number[]) {
    if (types === null || types.length === 0) {
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig, value: null
      }
    }
    this.fireFilterByTypes(types);

  }

  public fireFilterByStatuses(states: number[]) {
    if (states.length === 0) {
      this.requestStatesSelectConfig = {
        ...this.requestStatesSelectConfig,
        value: states
      };
    }
    this.fireFilterByStatuses(states)
  }
  public fireClearDateFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    const dateFilter = {
      from: null,
      to: null
    };
    this.fireFilterMyTeamRequestsByDate(dateFilter)
  }

  public clearFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    this.requestTypesSelectConfig = {
      ...this.requestTypesSelectConfig,
      value: this._store.selectSnapshot(MyTeamRequestsState.filtration).types ?? []
    }
    this.requestStatesSelectConfig = {
      ...this.requestStatesSelectConfig,
      value: this._store.selectSnapshot(MyTeamRequestsState.filtration)?.states ?? []
    };
    this.isSearchReset = true;
  }
  ngOnDestroy(): void {
    // reset state value to the initial one
    this._store.dispatch(new StateOverwrite([MyTeamRequestsState, new MyTeamRequestsStateModel()]))
  }
}
