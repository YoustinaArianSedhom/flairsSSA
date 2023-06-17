import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ssa-training-request-form',
  templateUrl: './training-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TrainingRequestFormComponent  {

  public formControls: { [control: string]: AbstractControl | FormControl };
  public trainingForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<TrainingRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }

  /* ________________________________________________ FORM ACTIONS ________________________________________________*/
  public submit() {
    const formBody: REQUESTS_MODELS.TrainingRequestFormBody = {
      ...this.trainingForm.getRawValue()
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreateTrainingRequest(formBody))
      .subscribe(
        () => { },
        //handling errors
        ((e: HttpErrorResponse) => {
          if (e.error.errorMessage && e.error.errorCode === 1) {
            let message = e.error.errors.filter((error, index) => {
              return e.error.errors.indexOf(error) === index
            })
            message = message.join(" . ")
            this._openFailureSnackbar(message)
          }
        }),
        //on complete
        () => {
          this._snackbarService.openSuccessSnackbar({
            message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
              'Your Training request'
            ),
            duration: 5,
            showCloseBtn: false,
          });
          this._dialogRef.close();
        });
  }

  public cancel() {
    this._dialogRef.close();

  }
  
  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false
    });
  }

  /**
   * @description initiate raise request form 
   */
  private _initForm() {
    this.trainingForm = this._formBuilder.group({
      trainingName: ['', [Validators.required, this._validationService.whiteSpacesOnlyValidation()]],
      courseDescription: ['', [Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      courseLink: ['', [Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      place: ['', [Validators.maxLength(200), Validators.pattern(/^$|.*\S+.*/)]],
      expectedPrice: [null, [Validators.max(999999999), Validators.min(1)]],
      impact: ['', [Validators.required, Validators.maxLength(2000), this._validationService.whiteSpacesOnlyValidation()]],
    });
    this.formControls = provideReactiveFormGetters(this.trainingForm, '');
  }

  
}
