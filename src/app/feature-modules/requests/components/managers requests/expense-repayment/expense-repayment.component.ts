import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import * as MY_REQUESTS_CONFIG from '@modules/requests/model/requests.config';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialogRef } from '@angular/material/dialog';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import moment from 'moment-timezone';


@Component({
  selector: 'ssa-expense-repayment',
  templateUrl: './expense-repayment.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host ::ng-deep .mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle,
      :host ::ng-deep.mat-radio-button.mat-accent .mat-radio-inner-circle{
        border-color: var(--primary);
        background: var(--primary); }
        @media only screen and (min-width: 750px) and (max-width: 910px) {
  .radioButton {
    width: 100%;
  }
        @media only screen and (min-width: 930px){
  .radioButton {
    width: 50%;
  }
}
}
    `
  ]
})
export class ExpenseRepaymentComponent implements OnInit {
  @ViewSelectSnapshot(RequestsStateSelectors.myCurrentMonthlyTeamBudget) public myCurrentMonthlyTeamBudget: REQUESTS_MODELS.myCurrentMonthlyTeamBudget;
  @ViewSelectSnapshot(RequestsStateSelectors.repaymentTypes) public repaymentTypes: REQUESTS_MODELS.RepaymentTypes[];
  @ViewSelectSnapshot(RequestsStateSelectors.allSubsEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];

  public expenseRepaymentRequestForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public dateConfig: { min: Date } = { min: new Date() }
  public requestTypes = MY_REQUESTS_CONFIG.ExpenseRepaymentTypes
  public selectedEmployees: any[] = [];
  public remainingBudget: string
  public showAndHideAutoComplete: boolean = true
  public showAndHideSpinner: boolean = false

  constructor(private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ExpenseRepaymentComponent>,
    private _snackbarService: SnackBarsService,
    private _store: Store) { }

  @Dispatch() private GetMyCurrentMonthlyTeamBudget() { return new REQUESTS_ACTIONS.GetMyCurrentMonthlyTeamBudget(); }
  @Dispatch() private GetRepaymentTypes() { return new REQUESTS_ACTIONS.GetRepaymentTypes(); }
  ngOnInit(): void {
    this._initeForm()
    this.GetMyCurrentMonthlyTeamBudget()
    this.GetRepaymentTypes()
  }





  public onChangeExpenseRepayment(value) {
    this.remainingBudget = this.myCurrentMonthlyTeamBudget.budgetItemsDetails.find(item => item.budgetItemTypeId === value).budgetItemRemainingAmount.toString()
  }

  public onChangeRequestType(request: MatRadioChange) {
    this.selectedEmployees = [];
    if (request.value === 0) {
      this.showAndHideAutoComplete = true
      this.showAndHideSpinner = false
      this.expenseRepaymentRequestForm.controls.beneficiaries.patchValue(this.selectedEmployees);
    }
    if (request.value === 1) {
      this.showAndHideAutoComplete = false
      this.showAndHideSpinner = true
      this._store.dispatch(new REQUESTS_ACTIONS.GetAllMySubsEmployeesAutoComplete('')).subscribe(() => {
        this.selectedEmployees = this.employeesList
        this.expenseRepaymentRequestForm.controls.beneficiaries.setValue(this.employeesList.map((employeesList) => employeesList.organizationEmail))
        this.showAndHideSpinner = false

      })
    }
  }

  onChangeDueDate() {
    this.expenseRepaymentRequestForm.controls.dueDate.patchValue(moment(this.expenseRepaymentRequestForm.controls.dueDate.value).format('YYYY-MM-DD'))
  }

  public addEmployee = (data: MY_REQUESTS_MODELS.EmployeeModel[]): void => {
    this.selectedEmployees = data ? [...data] : null;
    this.expenseRepaymentRequestForm.controls.beneficiaries.setValue(this.selectedEmployees.map((selectedEmployee) => selectedEmployee.organizationEmail))
  }

  public checkValidity(val, controlName: string) {
    if (val.value.trim() === '') {
      this.formControls[controlName].markAsTouched()
    }
  }

  public removeEmployee(itemID) {
    this.showAndHideSpinner = false
    this.selectedEmployees = this.selectedEmployees.filter(item => item.id !== itemID)
    this.expenseRepaymentRequestForm.controls.beneficiaries.setValue(this.selectedEmployees.map((selectedEmployee) => selectedEmployee.organizationEmail))
    this.expenseRepaymentRequestForm.controls.radioButton.patchValue(false)
  }

  public onSubmit() {
    this._store.dispatch(new REQUESTS_ACTIONS.CreateNewExpenseRepaymentRequest(this.expenseRepaymentRequestForm.value)).subscribe(() => {
    },
      // faliure case
      (err) => {
        if (err.error.errorMessage && err.error.errorCode === 1) {
          let message = err.error.errors.filter((error, index) => {
            return err.error.errors.indexOf(error) === index
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
            'Your Expense Repayment Request'
          ),
          duration: 5,
          showCloseBtn: false,
        })
        this.cancel();
      })
  }
  public cancel() {
    this._dialogRef.close();
  }
  private _initeForm() {
    this.expenseRepaymentRequestForm = this._fb.group({
      expenseTypeId: ["", Validators.required],
      amount: ["", [Validators.required, Validators.min(0)]],
      radioButton: [0],
      repaymentType: ["", Validators.required],
      dueDate: ["", Validators.required],
      beneficiaries: [[], [Validators.required]],
      instanceNote: [""]
    })
    this.formControls = provideReactiveFormGetters(this.expenseRepaymentRequestForm, '');
  }
}
