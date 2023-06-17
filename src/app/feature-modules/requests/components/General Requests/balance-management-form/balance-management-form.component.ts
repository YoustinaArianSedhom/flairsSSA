import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as MY_REQUESTS_CONFIG from '@modules/requests/model/requests.config';
import { Store } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { SSAConfigInst } from 'src/app/config/app.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';

@Component({
  selector: 'ssa-balance-management-form',
  templateUrl: './balance-management-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host ::ng-deep .mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle,
      :host ::ng-deep.mat-radio-button.mat-accent .mat-radio-inner-circle{
        border-color: var(--primary);
        background: var(--primary);
      }
      .covered-days{
        background: var(--primary);
        color:white;
        font-size:1rem;
      }
      ::ng-deep .balance_icon{
        color:var(--primary)
      }
      ::ng-deep .mat-form-field-appearance-standard .mat-form-field-flex{
        padding:0px
      }
      mat-chip.mat-chip { 
        border-radius: 0 !important;
        padding: 1rem 0.5rem !important;
        min-height: auto !important;
        font-size: 0.8rem !important;
        font-style: italic !important;
        background: #D9D9D9 !important;
        color: #847e7e !important;
      }
    `
  ]
})
export class BalanceManagementFormComponent implements OnInit {

  @ViewSelectSnapshot(RequestsStateSelectors.allEmployees) public allEmployees: MY_REQUESTS_MODELS.EmployeeModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.allTeams) public allTeams: MY_REQUESTS_MODELS.TeamModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.allCycles) public allCycles: MY_REQUESTS_MODELS.CycleModel[];

  public balanceManageForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public requestTypes = MY_REQUESTS_CONFIG.BalanceRequestTypes
  public leaveTypes = MY_REQUESTS_CONFIG.BalanceLeaveTypes

  public selectedEmployees: any[] = [];
  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<BalanceManagementFormComponent>,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) {
  }




  onCycleSelect(cycle: MY_REQUESTS_MODELS.CycleModel) {
    cycle ? this.formControls.cycleId.setValue(cycle.id) : this.formControls.cycleId.setValue(null)
  }
  ngOnInit(): void {
    // forkJoin([
    //   this._store.dispatch([
    //     new MY_REQUESTS_ACTIONS.GetAllCycles(),
    //     new MY_REQUESTS_ACTIONS.SearchEmployees('', true),
    //     new MY_REQUESTS_ACTIONS.GetAllTeams(''),
    //   ])])

    this._initForm();


  }

  public onChangeRequestType(request: MatRadioChange) {
    this.selectedEmployees = [];

    if (request.value === 0) {
      this.balanceManageForm.get('teamId').disable();
      this.balanceManageForm.get('selectedEmployeesOrganizationEmails').enable();
    } else if (request.value === 1) {
      this.balanceManageForm.get('teamId').enable();
      this.balanceManageForm.get('selectedEmployeesOrganizationEmails').disable();
    } else {
      this.balanceManageForm.get('teamId').disable();
      this.balanceManageForm.get('selectedEmployeesOrganizationEmails').disable();
    }


  }


  public cancel() {
    this._dialogRef.close();
  }
  public checkValidity(val, controlName: string) {

    if (val.value.trim() === '') {
      if (controlName !== 'selectedEmployeesOrganizationEmails') {
        this.formControls[controlName].setValue('')
      }
      this.formControls[controlName].markAsTouched()
    }
  }

  public onSubmit() {
    if (this.balanceManageForm.get('selectedEmployeesOrganizationEmails').value) {
      const emails = [];
      this.balanceManageForm.get('selectedEmployeesOrganizationEmails').value.map((employee: MY_REQUESTS_MODELS.EmployeeModel) => {
        emails.push(employee.organizationEmail)
      })
      this.balanceManageForm.patchValue({ selectedEmployeesOrganizationEmails: emails })
    }

    if (!this.balanceManageForm.get('teamId').value) {

      this.balanceManageForm.patchValue({ teamId: 0 })
    }
    this.balanceManageForm.patchValue({ reason: this.balanceManageForm.get('reason').value.trim(), recoveredDays: parseFloat(this.balanceManageForm.get('recoveredDays').value) })

    this._store.dispatch(new MY_REQUESTS_ACTIONS.CreateNewBalanceManagementRequest({ ...this.balanceManageForm.value, teamId: this.formControls.teamId.value })).subscribe(
      () => { },
      (e) => {
        console.log(e)
      },
      () => {
        this._snackbarService.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
            `Your Balance Management request`
          ),
          duration: 5,
          showCloseBtn: false,
        });
        this._dialogRef.close();
      }
    )
  }



  /**
   * employee autocomplete
   */

  public addEmployee = (data: MY_REQUESTS_MODELS.EmployeeModel[]): void => {
    this.selectedEmployees = data ? [...data] : null;
    this.balanceManageForm.patchValue({
      selectedEmployeesOrganizationEmails: this.selectedEmployees,
      teamId: 0
    })
  }

  public addTeam = (data: MY_REQUESTS_MODELS.TeamModel): void => {
    const value = data ? data.id : null;
    this.balanceManageForm.patchValue({
      selectedEmployeesOrganizationEmails: null,
      teamId: value
    })
  }

  public removeEmployee(index) {
    this.selectedEmployees.splice(index, 1);
    this.selectedEmployees = [...this.selectedEmployees];
    this.balanceManageForm.controls.selectedEmployeesOrganizationEmails.setValue([...this.selectedEmployees])

  }

  private _initForm() {
    this.balanceManageForm = this._formBuilder.group({
      leaveType: [0],
      balanceFor: [0],
      teamId: [{ value: null, disabled: true }, [Validators.required]],
      selectedEmployeesOrganizationEmails: [{ value: null, disabled: false }, [Validators.required]],
      cycleId: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      recoveredDays: ["1.00", [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
    })
    this.formControls = provideReactiveFormGetters(this.balanceManageForm, '');

  }



}
