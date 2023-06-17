import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { OnInit } from '@angular/core';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment-timezone'

@Component({
  selector: 'ssa-create-allocation-request-form',
  templateUrl: './create-allocation-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      ::ng-deep.workAmountDropDown{
        margin-top: 20px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CreateAllocationRequestFormComponent implements OnInit {
  @ViewSelectSnapshot(RequestsStateSelectors.currentLeaveBalance) public currentLeaveBalance: MY_REQUESTS_MODELS.CurrentLeaveBalanceModel;
  @ViewSelectSnapshot(RequestsStateSelectors.joinedEntity) private _joinedEntity: MY_REQUESTS_MODELS.JoinedEntityFormModel;
  public exampleHeader = ExampleHeader;
  public allocationRequestForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public dateConfig: { max: Date } = {
    max: new Date()
  }
  public filterDays = this._filterDate.bind(this); // bind this class to datePickerFilter function
  public amounts: { name: string, value: number }[] = [
    {
      name: 'Full day',
      value: 1
    },
    {
      name: '0.75 day',
      value: 0.75
    },
    {
      name: '0.5 day',
      value: 0.5
    },
    {
      name: '0.25 day',
      value: 0.25
    },
  ]
  constructor(
    private _dialogRef: MatDialogRef<CreateAllocationRequestFormComponent>,
    private _formBuilder: FormBuilder,
    private _snackbarService: SnackBarsService,
    private _store: Store
  ) {
  }
  @Dispatch() private _fireGetMyLeaveBalance() { return new MY_REQUESTS_ACTIONS.GetMyLeaveBalance() }
  @Dispatch() private _fireGetMyJoinedEntity() { return new MY_REQUESTS_ACTIONS.GetMyJoinedEntity() }
  ngOnInit(): void {
    this._fireGetMyLeaveBalance();
    this._fireGetMyJoinedEntity()
    this._initForm()
  }

  public onSubmit() {

    const body = {
      Day: moment(this.formControls.Day.value).subtract(2, "hours").utc(true).format(),
      entityId: this._joinedEntity.entityId,
      reason: this.formControls.reason.value.trim(),
      workAmount: this.formControls.workAmount.value
    };

    this._store.dispatch(new MY_REQUESTS_ACTIONS.CreateAllocationRequest(body)).subscribe(() => { },
      (e: HttpErrorResponse) => {
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
      },
      () => {
        this._snackbarService.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
            `Your Allocation request`
          ),
          duration: 5,
          showCloseBtn: false,
        });
        this._dialogRef.close();
      }
    )

  }
  public cancel() {
    this._dialogRef.close();
  }



  private _filterDate(date: Date): any {
    let flag = false;
    let formattedDate = moment(date).subtract(2, "hours").utc(true).format();
    if (date && this.currentLeaveBalance) {
      if (this.currentLeaveBalance?.weekendDays?.includes(date?.getDay())) {
        flag = true
      }
      this.currentLeaveBalance?.holidays?.map((holiday: MY_REQUESTS_MODELS.Holiday) => {
        if(moment(formattedDate).isSameOrAfter(holiday.from) && moment(formattedDate).isSameOrBefore(holiday.to)){
          flag = true
        }
      })
    }
    return flag
  }



  private _initForm() {
    // eslint-disable-next-line deprecation/deprecation
    this.allocationRequestForm = this._formBuilder.group({
      Day: ['', [Validators.required]],
      workAmount: [1, [Validators.required]],
      entityId: [0],
      reason: ['', [Validators.required, Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],

    })
    this.formControls = provideReactiveFormGetters(this.allocationRequestForm, '');

  }
}


/** Custom header component for datepicker. */
@Component({
  selector: 'ssa-example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5em;
    }
    ::ng-deep.mat-calendar-body-label{
      opacity: 0;
    }
    ::ng-deep.mat-calendar-body-label[colspan="7"] {
    display: none;
    }
    .example-header-label {
      height: 1em;
      font-weight: 500;
      text-align: center;
      margin:0px 1.5rem;
      font-weight:800;
    }
  `],
  template: `
    <div class="example-header">

      <button mat-icon-button (click)="previousClicked('month')">
        <span class=" ml-4  text-2xl text-gray-500 font-bold"><</span>
        </button>
        <span class="example-header-label text-primary">{{periodLabel}}</span>
        <button mat-icon-button (click)="nextClicked('month')">
        <span class="mr-4 text-2xl text-gray-500 font-bold">></span>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ExampleHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearA11yLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}
