import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { AllRequestsState, AllRequestsStateModel } from '../../state/all-requests.state';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';
import * as ALL_REQUESTS_CONFIG from '@modules/all-requests/models/all-requests.config';
import * as ALL_REQUESTS_ACTIONS from '@modules/all-requests/state/all-requests.actions'
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SSAConfigInst } from 'src/app/config/app.config';

@Component({
  selector: 'ssa-manage-all-requests',
  templateUrl: './manage-all-requests.component.html',
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
export class ManageAllRequestsComponent implements OnInit, OnDestroy {

  @ViewSelectSnapshot(AllRequestsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(AllRequestsState.pagination) public pagination: PaginationConfigModel;
  @Select(AllRequestsState.allRequests) public allRequests$: Observable<ALL_REQUESTS_MODELS.AllRequestModel[]>
  @ViewSelectSnapshot(AllRequestsState.showDetails) public showDetails: boolean;

  public tableActions = {
    paginate: ALL_REQUESTS_ACTIONS.PaginateAllRequests,
    sort: ALL_REQUESTS_ACTIONS.SortAllRequests
  }

  public resetSearch:boolean=false;

  public headInformation: HeadInformationModel = {
    title: `All Requests`
  }

  public requestTypesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request type',
    multiple: true,
    value: this._store.selectSnapshot(AllRequestsState.filtration).types ?? [],
  }
  public requestTypes = SSAConfigInst.GetSortedRequestTypes();


  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Status',
    multiple: true,
    value: this._store.selectSnapshot(AllRequestsState.filtration).states ?? [],
  }
  public requestStatuses = ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUES_LIST;


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

  /* _____________________ Actions ________________________*/
  @Dispatch() public fireSearchMyRequestsAction(searchQuery: string) { return new ALL_REQUESTS_ACTIONS.SearchAllRequests(searchQuery) }
  @Dispatch() public fireFilterMyRequestsByTypesAction(types: number[]) { return new ALL_REQUESTS_ACTIONS.FilterAllRequests({ types }) }
  @Dispatch() public fireFilterMyRequestsByStatesAction(states: number[]) { return new ALL_REQUESTS_ACTIONS.FilterAllRequests({ states }) }
  @Dispatch() private _fireGetUsersAction() { return new ALL_REQUESTS_ACTIONS.GetAllRequests() }
  @Dispatch() private _ResetFilterMyRequests() { return new ALL_REQUESTS_ACTIONS.ResetFiltration() }

  ngOnInit(): void {
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this._fireGetUsersAction();
    this.refreshHeadInformation(this.headInformation);
  }
  public refreshHeadInformation(config: HeadInformationModel): void {
    this._headRefresher.refresh(config);
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
  public exportAllRequests(){
    this._store.dispatch(ALL_REQUESTS_ACTIONS.ExportAllRequests).subscribe(()=>{}, async (error) => {
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

  ngOnDestroy(): void {
    this._store.dispatch(new StateOverwrite([AllRequestsState, new AllRequestsStateModel()]))
  }

}
