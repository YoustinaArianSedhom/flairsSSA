import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { Select, Store } from '@ngxs/store';
import { HttpErrorResponse } from '@angular/common/http';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { LeaveRequestComponent } from '@flairstechproductunit/flairstech-libs';
import { Observable } from 'rxjs';

@Component({
  selector: 'ssa-leave-request-form',
  templateUrl: './leave-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class LeaveRequestFormComponent implements OnInit {
  @ViewSelectSnapshot(RequestsStateSelectors.currentLeaveBalance) public currentLeaveBalance: MY_REQUESTS_MODELS.CurrentLeaveBalanceModel;
  @ViewSelectSnapshot(RequestsStateSelectors.cyclesByEmployeeCountry) public cyclesByEmployeeCountry: MY_REQUESTS_MODELS.CycleByEmployeeCountryModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.currentCycle) public currentCycle: MY_REQUESTS_MODELS.CycleByEmployeeCountryModel;
  @Select(RequestsStateSelectors.calculateLeaveDays) public remainingBalance$: Observable<number>;

  leaveTypes = [
    {
      name: 'Annual Leave',
      value: 'annual'
    },
    {
      name: 'Sick Leave',
      value: 'sick'
    },
    {
      name: 'Emergency Leave',
      value: 'emergency'
    },
    {
      name: 'Maternity Leave',
      value: 'maternity'
    },
    {
      name: 'Military Leave',
      value: 'military'
    },
    {
      name: 'Bereavement Leave',
      value: 'bereavement'
    },
    {
      name: 'Half Day',
      value: 'half-day'
    }

  ];

  private leaveRequestDialog: MatDialogRef<LeaveRequestComponent>

  constructor(private _matDialog: MatDialog, private _snackbarService: SnackBarsService, private _store: Store) {

    this.remainingBalance$.subscribe((data) => {
      if (this.leaveRequestDialog)
        this.leaveRequestDialog.componentInstance.data.remainingBalance = data;
    })
  }

  @Dispatch() private _fireGetMyLeaveBalance(cycleId?: string) { return new REQUESTS_ACTIONS.GetMyLeaveBalance(cycleId) }
  @Dispatch() private _fireCalculateLeaveDays(body: REQUESTS_MODELS.LeaveRequestFormBodyModel) { return new REQUESTS_ACTIONS.CalculateLeaveDays(body) }
  @Dispatch() private _fireGetCyclesByEmployeeCountry() { return new REQUESTS_ACTIONS.GetCyclesByEmployeeCountry()}
  ngOnInit() {
    this._fireGetCyclesByEmployeeCountry();
    this._fireGetMyLeaveBalance()
  }
  

  public openLeaveForm() {

    this.leaveRequestDialog = this._matDialog.open(LeaveRequestComponent, {
      panelClass: ['form-dialog--small'],
      data: { leaveTypes: this.leaveTypes, currentLeaveBalance: this.currentLeaveBalance, remainingBalance: 0, cyclesByEmployeeCountry: this.cyclesByEmployeeCountry }
    })


    this.leaveRequestDialog.componentInstance.fireCalculateLeaveDays.subscribe((body) => { this._fireCalculateLeaveDays(body) });
    this.leaveRequestDialog.componentInstance.onSubmitForm.subscribe((body) => this.onSubmit(body));
    this.leaveRequestDialog.componentInstance.fireOnCycleChange.subscribe((cycleId) => this.handleOnCycleChange(cycleId))

    this.leaveRequestDialog.afterClosed().subscribe(()=>{
     this._fireGetMyLeaveBalance();
    })

  }

  public handleOnCycleChange(cycleId: string) {
    this._store.dispatch(new REQUESTS_ACTIONS.GetMyLeaveBalance(cycleId)).subscribe(() => {
      this.leaveRequestDialog.componentInstance.data.currentLeaveBalance = this.currentLeaveBalance;
      this.leaveRequestDialog.componentInstance.handleTypeChange();
    })
  }

  public onSubmit(data: { body: any, type: string }) {
    switch (data.type) {
      case 'annual':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewAnnualLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Annual Leave');
          })
        break;

      case 'maternity':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewMaternityLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Maternity Leave');
          })
        break;
      case 'sick':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewSickLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Sick Leave');
          })
        break;

      case 'military':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewMilitaryLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Military Leave');
          })
        break;

      case 'emergency':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewEmergencyLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Emergency Leave');
          })
        break;
      case 'bereavement':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewBereavementLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Bereavement Leave');
          })
        break;

      case 'half-day':
        this._store.dispatch(new REQUESTS_ACTIONS.CreateNewHalfDayLeaveRequest(data.body)).subscribe(() => { },
          ((e: HttpErrorResponse) => {
            this._onRequestError(e)
          }),
          () => {
            this._onRequestSuccess('Half Day Leave');
          })
        break;
      default:
        break;
    }

  }



  private _onRequestSuccess(leaveType: string) {
    this._snackbarService.openSuccessSnackbar({
      message: `Your ${leaveType} request was successfully created`,
      duration: 5,
      showCloseBtn: false,
    });
    this.leaveRequestDialog.close();
    this._fireGetMyLeaveBalance();
    // this.handleCycle();
  }

  private _onRequestError(e: HttpErrorResponse) {
    if (e.error.errorMessage && e.error.errorCode === 1) {
      let message = e.error.errors.filter((error, index) => {
        return e.error.errors.indexOf(error) === index
      })
      message = message.join(" . ");
      this._snackbarService.openFailureSnackbar({
        message,
        duration: 5,
        showCloseBtn: false
      });
    }
  }



}
