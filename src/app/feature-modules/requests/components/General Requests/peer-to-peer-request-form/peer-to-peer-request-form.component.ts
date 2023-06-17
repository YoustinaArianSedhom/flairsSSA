import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as REQUESTS_ACTIONS from '../../../state/requests.actions';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_CONFIGS from '../../../model/requests.config'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from '../../../../../config/app.config';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ssa-peer-to-peer-request-form',
  templateUrl: './peer-to-peer-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class PeerToPeerRequestFormComponent implements OnInit, OnDestroy {

  @ViewSelectSnapshot(RequestsStateSelectors.allEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];

  public peerToPeerForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  private _employeesTypeAhead$ = new Subject<string>();

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _dialogRef: MatDialogRef<PeerToPeerRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }
  
  /* ______________________ ACTIONS TRIGGERS ____________________  */
  @Dispatch() private _fireClearAutocomplete() {
    return new REQUESTS_ACTIONS.ClearAllEmployeesListAutocomplete();
  }

  ngOnInit(): void {
    this._setupEmployeesNamesAutocomplete();

  }

  public onFocusAutoComplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete("."))
  }

  public fireAutocomplete() {
    this._employeesTypeAhead$.next(
      this.formControls.targetOrganizationEmail.value
    );
  }

  /*_______________FORM ACTIONS_____________*/
  public submit() {
    const formBody: REQUESTS_MODELS.PeerToPeerRequestFormBodyModel = {
      ...this.peerToPeerForm.getRawValue()
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreatePeerToPeerRequest(formBody))
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
              'Your Peer-to-Peer request'
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._fireClearAutocomplete();
  }

  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false
    });
  }

  private _initForm() {
    this.peerToPeerForm = this._formBuilder.group({
      targetOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ],
      ],

      reason: ['', [Validators.required, Validators.maxLength(500), this._validationService.whiteSpacesOnlyValidation()]],
      message: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]]
    });
    this.formControls = provideReactiveFormGetters(this.peerToPeerForm, '');
  }
  
  private _setupEmployeesNamesAutocomplete() {
    this._employeesTypeAhead$
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        // If there's no value
        if (!value.trim().length) {
          this._fireClearAutocomplete();
        } else this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete(value)).subscribe(() => {
          if (!this.employeesList.length) {
            this._snackbarService.openFailureSnackbar({
              message: REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail,
              duration: 5,
              showCloseBtn: false
            });
            this._fireClearAutocomplete();
          }
        }
        );
      });
    }
}
