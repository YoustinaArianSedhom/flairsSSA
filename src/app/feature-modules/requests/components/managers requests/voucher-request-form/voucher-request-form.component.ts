import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SSAConfigInst } from '../../../../../config/app.config'; // @todo create alias for config folder
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Store } from '@ngxs/store';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ssa-voucher-request-form',
  templateUrl: './voucher-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class VoucherRequestFormComponent implements OnInit, OnDestroy {
 
  @ViewSelectSnapshot(RequestsStateSelectors.mySubsEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.entityInfoVoucherRequest) public entityInfo: REQUESTS_MODELS.EntityInfoVoucherFormModel;
  
   // Types 
   types = [{ name: 'Addition', value: 0 },{ name: 'Customer Bonus', value: 1 }];

  
  
  public formControls: { [control: string]: AbstractControl | FormControl };
  public voucherForm: FormGroup;
  private _employeesTypeAhead$ = new Subject<string>();

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<VoucherRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }
  
   
  /* ____________________________________________ ACTIONS TRIGGERS _________________________________________________*/
  @Dispatch() private _fireClearEmployeesAutocomplete() {
    return new REQUESTS_ACTIONS.ClearMySubsEmployeeAutoComplete();
  }

  @Dispatch() private _fireClearEntitiesList() {
    return new REQUESTS_ACTIONS.ClearEntitiesListVoucherRequest();
  }
  

  ngOnDestroy(): void {
    this._fireClearEntitiesList();
    this._fireClearEmployeesAutocomplete();
  }

  ngOnInit(): void {
    this._setupEmployeesNamesAutocomplete();
  }
  

  /* __________________________________________________ AUTO COMPLETE _______________________________________________________*/

  /**
   * @description open all sub employees once the employee name field is on focus
   */
   public onFocusAutoComplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete('.'));
  }

  /**
   * @summary Emit new value to employees Autocomplete stream
   */
  public fireAutocomplete() {
    this._employeesTypeAhead$.next(
      this.formControls.targetOrganizationEmail.value
    );
  }
 /*________________________________________________TRIGGER ENTITY INFO_______________________________________________________*/

   public onSelectEmployeeEmail(employeeEmail: string) {
    this._store
      .dispatch(new REQUESTS_ACTIONS.GetEntityInfoVoucherRequest(employeeEmail))
      .subscribe(
        () => { },

        // Error handling
        (e: HttpErrorResponse) => {
          if (e.error.errorMessage) this._resetFromToDefaults();
        },

        // Complete Handling
        () => {
          this._patchFormValues(
            this._store.selectSnapshot(
              RequestsStateSelectors.entityInfoVoucherRequest
            )
          );
          this._fireClearEmployeesAutocomplete();
        }
      );
  }

  /* ________________________________________________ FORM ACTIONS ________________________________________________*/

  public submit() {
    const formBody: REQUESTS_MODELS.VoucherRequestFormBodyModel = {
      ...this.voucherForm.getRawValue(),
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      note: this.formControls.note.value.trim(),
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreateVoucherRequest(formBody))
      .subscribe(
        () => { },
        //handling errors
        (e: HttpErrorResponse) => {
          if (e.error.errorMessage && e.error.errorCode === 1) {
            let message = e.error.errors.filter((error, index) => {
              return e.error.errors.indexOf(error) === index
            })
            message = message.join(" . ")
            this._openFailureSnackbar(message)
          }
        },
        //on complete
        () => {
          this._snackbarService.openSuccessSnackbar({
            message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
              'Your Voucher request'
            ),
            duration: 5,
            showCloseBtn: false,
          });
          this._dialogRef.close();
        }
      );
  }

  public cancel() {
    this._dialogRef.close();
  }
  /**
   * @description to open a failure snackbar if there's a failed step in the process
   * @param message string value represent the message that would be displayed
   */

  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false,
    });
  }
  
  

  /**
   * @description initiate voucher request form
   */
  private _initForm() {
    this.voucherForm = this._formBuilder.group({
      targetOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation(),
        ],
      ],
      entityName: [{ value: '', disabled: true }, Validators.required],
      entityId: ['', Validators.required],
      amount: ['', [
        Validators.min(1),
        Validators.required
      ]],
      type: [0, Validators.required],
      note: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]],
    });
    this.formControls = provideReactiveFormGetters(this.voucherForm, '');
  }

  private _patchFormValues(entity: REQUESTS_MODELS.EntityInfoVoucherFormModel) {
    this.voucherForm.patchValue({
      ...entity,
    });
    this.formControls.entityName.enable();
  }

  /**
   * @description reset all form values to their default values except email and note
   */
  private _resetFormValues() {
    this.voucherForm.reset({
      targetOrganizationEmail: this.voucherForm.get('targetOrganizationEmail').value,
      note: this.voucherForm.get('note').value,
      entityName: { value: '', disabled: true }
    });
    this.voucherForm.get('targetOrganizationEmail').markAsDirty();
  }

  /**
   * @description clear all data in the form, entity list and auto complete employees list
   */
  private _resetFromToDefaults() {
    this._resetFormValues();
    this._fireClearEntitiesList();
    this._fireClearEmployeesAutocomplete();
  }

  

  /**
   * @description Apply the debouching functionality on the employeesTypeAhead
   * and check if there's a value then we should fire the auto complete and if not we will clear it
   */
  private _setupEmployeesNamesAutocomplete() {
    this._employeesTypeAhead$.pipe(debounceTime(500)).subscribe((value) => {
      // If there's no value
      if (!value.trim().length) {
        this._resetFromToDefaults();
      } else {
        this._store
          .dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete(value))
          .subscribe(() => {
            //if there's no matched employee name
            if (!this.employeesList.length) {
              this._openFailureSnackbar(
                REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail
              );
              this._resetFromToDefaults();
            }
          });
      }
    });
  }

}
