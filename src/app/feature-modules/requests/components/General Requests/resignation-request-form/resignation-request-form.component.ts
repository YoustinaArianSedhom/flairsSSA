import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as REQUESTS_CONFIGS from '@modules/requests/model/requests.config'
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ssa-resignation-request-form',
  templateUrl: './resignation-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host ::ng-deep .mat-checkbox-layout .mat-checkbox-label{
        white-space:normal;
        }
        :host ::ng-deep .mat-checkbox-inner-container{
          margin:6px 10px 0;
        }
        :host ::ng-deep .mat-checkbox-layout{
          align-items:flex-start;
        }
    `
  ]
})
export class ResignationRequestFormComponent implements OnInit {

  @ViewSelectSnapshot(RequestsStateSelectors.employeeResignationReasons) public reasons: string[];


  public ResignationRequestForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public showReasonTextArea: boolean;
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

  /*_____________________________Resignation Action triggers ________________________________*/
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



  public submit() {
    const body: REQUESTS_MODELS.ResignationRequestBodyModel = {
      ...this.ResignationRequestForm.getRawValue(),
      leaveDate: this._dateFormatter(this.formControls.leaveDate.value),
      notes: this.formControls.notes.value.trim(),
      reason: this.formControls.reason.value.trim(),
      acceptResignationTerm: this.formControls.acceptResignationTerm.value
    };
    this._store.dispatch(new REQUESTS_ACTIONS.CreateResignationRequest(body)).subscribe(
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
            'Your resignation request'
          ),
          duration: 5,
          showCloseBtn: false,
        });
        this._dialogRef.close();
      });
  }


  private _dateFormatter(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const newDate: string = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T00:00:00.000Z";
    return newDate;
  }

  private _initForm() {
    this.ResignationRequestForm = this._formBuilder.group({
      selectedReason: ["", [Validators.required]],
      reason: ["", [Validators.required, Validators.maxLength(120), Validators.pattern(/^$|.*\S+.*/)]],
      leaveDate: ["", [Validators.required]],
      submissionDate: [new Date()],
      notes: ['', [Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      acceptResignationTerm: [false, [Validators.requiredTrue]],

    })
    this.formControls = provideReactiveFormGetters(this.ResignationRequestForm, '');
  }


  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false
    });
  }

}
