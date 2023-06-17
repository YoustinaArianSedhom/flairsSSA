import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as EXPENSE_ACTIONS from '@modules/expense-history-page/state/expense-history.actions'
import * as EXPENSE_MODELS from '@modules/expense-history-page/models/expense-history.models';
import * as EXPENSE_CONFIG from '@modules/expense-history-page/models/expense-history.config'
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ExpenseState, ExpenseStateModel } from '../../state/expense-history.state';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
@Component({
  selector: 'ssa-manage-expense-history-page',
  templateUrl: './manage-expense-history-page.component.html',
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
export class ManageExpenseHistoryPageComponent implements OnInit, OnDestroy {
  @ViewChild('dateRange') datePicker: MatDatepicker<Date>;
  @ViewSelectSnapshot(ExpenseState.pagination) public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(ExpenseState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(ExpenseState.allManagers) public allManagers: EXPENSE_MODELS.ManagerModel[];
  @Select(ExpenseState.allExpenses) public allExpenses$: Observable<EXPENSE_MODELS.ExpenseModel[]>
  
  public dateFilter = {
    from: '',
    to: ''
  }
  public selectedManager = null;

  public resetSearch:boolean=false;

  public headInformation: HeadInformationModel = {
    title: `Expense History`
  }

  public requestStatesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Request Status',
    multiple: true,
    value: this._store.selectSnapshot(ExpenseState.filtration).states ?? [],
  }
  public requestStatuses = EXPENSE_CONFIG.EXPENSE_STATUES_LIST;


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
  
  @Dispatch() public exportExpenseToExcel() { return new EXPENSE_ACTIONS.ExportExpenseRequests()}
  @Dispatch() private _fireFilterExpenseRequests(filtration: EXPENSE_MODELS.ExpenseFiltrationModel) { return new EXPENSE_ACTIONS.FilterAllExpenseRequests(filtration)}
  @Dispatch() private _getAllExpenseRequests() { return new EXPENSE_ACTIONS.GetAllExpenseRequests()}
  @Dispatch() private _fireResetExpenseRequests() { return new EXPENSE_ACTIONS.ResetFilterAllExpenseRequests() }
  @Dispatch() private _fireGetAllManagers() { return new EXPENSE_ACTIONS.GetAllManagers() }

  ngOnInit(): void {
    this.refreshHeadInformation(this.headInformation);
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this._getAllExpenseRequests();
    this._fireGetAllManagers();
  }

  public refreshHeadInformation(config: HeadInformationModel): void {
    this._headRefresher.refresh(config);
  }
  
  ngOnDestroy(): void {
    this._store.dispatch(new StateOverwrite([ExpenseState, new ExpenseStateModel()]))
  }

  public onSearchChange(searchQuery:string){
    this._fireFilterExpenseRequests({searchQuery})
  }

  public onChangeToDate() {
    if (this.dateFilter.from && this.dateFilter.to) {
      const dateFilter = {
        from: new Date(this.dateFilter.from).toISOString(),
        to: new Date(this.dateFilter.to).toISOString()
      };
      this._fireFilterExpenseRequests({...dateFilter})
    }
  }

  public fireFilterManager(event:MatSelectChange){
    this.selectedManager = event.value
    this._fireFilterExpenseRequests({managerOrganizationEmail: event.value})
  }

  public fireClearDateFiltration() {
    this.dateFilter = {
      from: null,
      to: null
    }
    this._fireFilterExpenseRequests({...this.dateFilter})
  }

  public fireFilterByStatus(states :number[]){
    if (states === null || states.length === 0 ){
       this.requestStatesSelectConfig = {
         ...this.requestStatesSelectConfig , value : states
       }
    }  
    this._fireFilterExpenseRequests({states}) 
   }

  public resetFilter(){
    this.selectedManager = null
    this.resetSearch = !this.resetSearch;
    this.dateFilter = {from : '', to : ''}
    this.requestStatesSelectConfig = {
      ...this.requestStatesSelectConfig , value : []
    }
    this._fireResetExpenseRequests();
  }
}
