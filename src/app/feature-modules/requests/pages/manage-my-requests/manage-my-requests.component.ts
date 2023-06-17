import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';

import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_CONFIGS from '@modules/requests/model/requests.config';

import { Observable } from 'rxjs';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { BreakpointObserver } from '@angular/cdk/layout';
import { HeadInformationModel, HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { RequestsStateModel } from '@modules/requests/state/requests.state.model';
import { RequestsState } from '@modules/requests/state/requests.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SSAConfigInst } from 'src/app/config/app.config';


@Component({
  selector: 'ssa-my-requests',
  templateUrl: './manage-my-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .btn-req{
        margin-top:7px;
      }
      .no-margin{
        margin: 0px;
      }
    `,
  ],
})
export class ManageMyRequestsComponent implements OnInit, OnDestroy, HeadRefresherType {

  @ViewSelectSnapshot(RequestsStateSelectors.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(RequestsStateSelectors.paginationConfig) public pagination: PaginationConfigModel;
  @Select(RequestsStateSelectors.myRequests) public records$: Observable<MY_REQUESTS_MODELS.MyRequestModel[]>;

  @Input() public actions: { [key: string]: any } = {};

  public resetSearch:boolean=false;
  public requestTypes = SSAConfigInst.GetSortedRequestTypes();

  public requestStatuses = REQUESTS_CONFIGS.REQUEST_STATUES_LIST;

  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(RequestsStateSelectors.myRequestFiltration).types ?? [],
  }

  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Status',
    multiple: true,
    value: this._store.selectSnapshot(RequestsStateSelectors.myRequestFiltration).states ?? [],
  }
  public tableActions = {
    paginate: MY_REQUESTS_ACTIONS.PaginateMyRequests,
    sort: MY_REQUESTS_ACTIONS.SortMyRequests
  }


  public headInformation: HeadInformationModel = {
    title: 'My Requests'
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
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))){
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
     }

     /* _____________________ Actions Fires ________________________*/
    @Dispatch() public fireFilterMyRequestsByTypesAction(types: number[]) { return new MY_REQUESTS_ACTIONS.FilterMyRequests({ types }) }
    @Dispatch() public fireSearchMyRequestsAction(searchQuery: string) { return new MY_REQUESTS_ACTIONS.SearchMyRequests(searchQuery) }
    @Dispatch() public fireFilterMyRequestsByStatesAction(states: number[]) { return new MY_REQUESTS_ACTIONS.FilterMyRequests({ states }) }
    @Dispatch() private _ResetFilterMyRequests() { return new MY_REQUESTS_ACTIONS.ResetFilterMyRequests() }
    @Dispatch() private _fireGetUsersAction() { return new MY_REQUESTS_ACTIONS.GetMyRequests() }


  ngOnInit(): void {
    // window.screen.width < 768 ? this.isMobile = true : this.isMobile = false;
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this._fireGetUsersAction();
    this.refreshHeadInformation();
  }


  public refreshHeadInformation() {
    this._headRefresher.refresh(this.headInformation);
  }

  public fireFilterMyRequestsByTypes(types :number[]){
   if (types === null || types.length === 0){
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig , value :null
      }
   }  
   this.fireFilterMyRequestsByTypesAction(types) 
  }

  public fireFilterMyRequestsByStatus(status :number[]){
   if (status === null || status.length === 0 ){
      this.requestStatesSelectConfig = {
        ...this.requestStatesSelectConfig , value : status
      }
   }  
   this.fireFilterMyRequestsByStatesAction(status) 
  }
  public exportMyRequest(){
    this._store.dispatch(MY_REQUESTS_ACTIONS.ExportMyRequests).subscribe(()=>{}, async (error) => {
      const message = JSON.parse(await error.error.text()).errorMessage;
      this._snackbarService.openFailureSnackbar({
        message,
        duration: 5,
        showCloseBtn: false
      });
    })
  }
  
  public resetFilter(){
    this.resetSearch = !this.resetSearch;
      this.requestTypesSelectConfig = {
        ...this.requestTypesSelectConfig , value :null
      }
      this.requestStatesSelectConfig = {
        ...this.requestStatesSelectConfig , value : []
      }
      this._ResetFilterMyRequests();
  }
 

  public ngOnDestroy() {
    // this.fireSearchMyRequestsAction('');
    // reset state value to the initial one
    this._store.dispatch(new StateOverwrite([RequestsState, new RequestsStateModel()]))

  }

}
