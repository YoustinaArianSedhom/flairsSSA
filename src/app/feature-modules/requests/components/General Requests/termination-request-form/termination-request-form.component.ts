import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ResignationRequestFormComponent } from '../resignation-request-form/resignation-request-form.component';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { HttpErrorResponse } from '@angular/common/http';
import { SSAConfigInst } from 'src/app/config/app.config';

@Component({
  selector: 'ssa-termination-request-form',
  templateUrl: './termination-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TerminationRequestFormComponent implements OnInit {
  @ViewSelectSnapshot(RequestsStateSelectors.employeeResignationReasons) public reasons: string[];
  public TerminationForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public showReasonTextArea: boolean = false;
  public leaveDateConfig: { min: Date; max: Date; } = {
    min: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) //1 year from now
  }
  constructor(
    private _formBuilder: FormBuilder,
    private _snackbarService: SnackBarsService,
    private _dialogRef: MatDialogRef<ResignationRequestFormComponent>,
    private _store: Store
  ) { }
  @Dispatch() private _getEmployeeResignationReasons() {
    return new REQUESTS_ACTIONS.GetEmployeeResignationReasons();
  }
  ngOnInit(): void {

    this._initForm();
    this._getEmployeeResignationReasons();

  }
  public onSelectReason(reason) {
    if (reason === 'Others') {
      this.showReasonTextArea = true;
      this.formControls.reason.setValue('');
    } else {
      this.showReasonTextArea = false;
      this.formControls.reason.setValue(reason);

    }
  }

  public employeeSelected(emp: any) {
    emp ? this.formControls.targetOrganitionalEmail.setValue(emp?.organizationEmail) : this.formControls.targetOrganitionalEmail.setValue(null)
  }

  public onSubmit() {
    const body: REQUESTS_MODELS.TerminationRequestBodyModel = {
      ...this.TerminationForm.getRawValue(),
      leaveDate: this._dateFormatter(this.formControls.leaveDate.value),
      notes: this.formControls.notes.value.trim(),
      reason: this.formControls.reason.value.trim(),
      acceptResignationTerm: this.formControls.acceptResignationTerm.value
    };
    this._store.dispatch(new REQUESTS_ACTIONS.CreateTerminationRequest(body)).subscribe(
      () => { },
      //error handling
      ((e: HttpErrorResponse) => {
        if (e.error.errorMessage && e.error.errorCode === 1) {
          let message = e.error.errors.filter((error, index) => {
            return e.error.errors.indexOf(error) === index
          })
          message = message.join(" . ")
          this._openFailureSnackbar(message)
        }
      }),
      () => {
        this._snackbarService.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
            'Termination request'
          ),
          duration: 5,
          showCloseBtn: false,
        });
        this._dialogRef.close();
      });
  }



  public checkValidity(val, controlName: string) {
    if (val.value.trim() === '') {
      this.formControls[controlName].markAsTouched()
    }
  }

  public cancel() {
    this._dialogRef.close();
  }

  private _initForm() {
    this.TerminationForm = this._formBuilder.group({
      targetOrganitionalEmail: ["", [Validators.required]],
      reason: ["", [Validators.required, Validators.maxLength(120), Validators.pattern(/^$|.*\S+.*/)]],
      selectedReason: ["", [Validators.required]],
      leaveDate: ["", [Validators.required]],
      submissionDate: [new Date()],
      notes: ['', [Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      acceptResignationTerm: [false, [Validators.requiredTrue]],
    })
    this.formControls = provideReactiveFormGetters(this.TerminationForm, '');
  }

  private _dateFormatter(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const newDate: string = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T00:00:00.000Z";
    return newDate;
  }

  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false
    });
  }
}
