import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { AllLeaveStateSelectors } from '@modules/all-leave/state/all-leave.selectors';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as LEAVE_ACTIONS from '../../state/actions/all-leave.actions';
import * as ALL_LEAVE_CONFIG from '@modules/all-leave/model/all-leave.config';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { Observable } from 'rxjs';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { AllLeaveState } from '@modules/all-leave/state/all-leave.state';
import { AllLeaveStateModel } from '@modules/all-leave/state/all-leave.state.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'ssa-all-leave',
  templateUrl: './all-leave.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AllLeaveComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(AllLeaveStateSelectors.allLeaveSearchQuery) public searchQuery: string;
  @ViewSelectSnapshot(AllLeaveStateSelectors.allLeavePagination) public pagination: PaginationConfigModel;
  @Select(AllLeaveStateSelectors.allLeave) public records$: Observable<REQUESTS_MODELS.MyRequestModel[]>;

  public dateFilter = {
    from: '',
    to: ''
  }
  public tableActions = {
    paginate: LEAVE_ACTIONS.PaginateAllLeave,
    sort: LEAVE_ACTIONS.SortAllLeave
  }

  public headInformation: HeadInformationModel = {
    title: 'All Leave'
  }

  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(AllLeaveStateSelectors.LeaveFiltration).types ?? [],
  }
  public requestTypes = ALL_LEAVE_CONFIG.LEAVE_TYPES_LIST;


  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Status',
    multiple: true,
    value: this._store.selectSnapshot(AllLeaveStateSelectors.LeaveFiltration).states ?? [],
  }
  public requestStatuses = ALL_LEAVE_CONFIG.LEAVE_STATUES_LIST;

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
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))){
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
  }

  /* _____________________ Actions Fires ________________________*/
  @Dispatch() public fireSearchAllLeaveAction(searchQuery: string) { this.isSearchReset = false; return new LEAVE_ACTIONS.SearchAllLeave(searchQuery) }
  @Dispatch() public fireFilterAllLeaveByTypesAction(types: number[]) { return new LEAVE_ACTIONS.FilterAllLeave({ types }) }
  @Dispatch() public fireFilterAllLeaveByStatesAction(states: number[]) { return new LEAVE_ACTIONS.FilterAllLeave({ states }) }
  @Dispatch() public fireFilterAllLeaveByDateFilter(date) { return new LEAVE_ACTIONS.FilterAllLeave({ ...date }) }
  @Dispatch() private _fireGetUsersAction() { return new LEAVE_ACTIONS.GetAllLeave() }

  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');

    this._fireGetUsersAction();
    this.refreshHeadInformation(this.headInformation);
  }
  public refreshHeadInformation(config: HeadInformationModel): void {
    this._headRefresher.refresh(config);
  }

  public onChangeToDate() {
    if (this.dateFilter.from && this.dateFilter.to) {
      const filter = {
        from: new Date(this.dateFilter.from).toISOString(),
        to: new Date(this.dateFilter.to).toISOString()
      }
      this.fireFilterAllLeaveByDateFilter(filter)
    }
  }
  public fireClearDateFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    const dateFilter = {
      from: null,
      to: null
    };
    this.fireFilterAllLeaveByDateFilter(dateFilter)
  }

  public fireFilterByStatuses(states: number[]) {
    if (states.length === 0) {
      this.requestStatesSelectConfig = {
        ...this.requestStatesSelectConfig,
        value: states
      };
    }
    this.fireFilterAllLeaveByStatesAction(states)
  }

  public fireFilterByTypes(types: number[]) {
    if (types === null || types.length === 0) {
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig, value: null
      }
    }
    this.fireFilterAllLeaveByTypesAction(types)
  }

  public resetFiltration() {
    this._store.dispatch(new LEAVE_ACTIONS.ResetFiltration()).subscribe(res => {
      this.clearFiltration();

    })
  }

  public clearFiltration() {
    this.dateFilter.from = '';
    this.dateFilter.to = '';
    this.requestTypesSelectConfig = {
      ...this.requestTypesSelectConfig,
      value: this._store.selectSnapshot(AllLeaveStateSelectors.LeaveFiltration).types ?? [],

    }
    this.requestStatesSelectConfig = {
      ...this.requestStatesSelectConfig,
      value: this._store.selectSnapshot(AllLeaveStateSelectors.LeaveFiltration).states ?? [],
    };
    this.isSearchReset = true;
  }
  ngOnDestroy() {
    // this.fireSearchAllLeaveAction('');
    // reset state value to the initial one
    this._store.dispatch(new StateOverwrite([AllLeaveState, new AllLeaveStateModel()]))
  }

}
