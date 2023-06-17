import { Component, OnDestroy, OnInit } from '@angular/core';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
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
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'ssa-gouna-voucher-request-form',
  templateUrl: './gouna-voucher-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      },
    `
  ],
  styleUrls:['./gouna-voucher-request-form.component.scss']
})
export class GounaVoucherRequestFormComponent implements OnInit, OnDestroy {

   

  @ViewSelectSnapshot(RequestsStateSelectors.allEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];

  public formControls: { [control: string]: AbstractControl | FormControl };
  public gounaVoucherForm: FormGroup;
  private _employeesTypeAhead$ = new Subject<string>();

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<GounaVoucherRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _validationService: ValidationService
  ) {
    this._initForm();

  }

  /* ____________________________________________ ACTIONS TRIGGERS _________________________________________________*/
  @Dispatch() private _fireClearAutocomplete() {
    return new REQUESTS_ACTIONS.ClearAllEmployeesListAutocomplete();
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
      this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete("."))
  }


  /**
   * @summary Emit new value to employees Autocomplete stream
   */
  public fireAutocomplete() {
    this._employeesTypeAhead$.next(this.formControls.targetOrganizationEmail.value);
  }

   /* ________________________________________________ FORM ACTIONS ________________________________________________*/
   public submit() {
    const formBody: REQUESTS_MODELS.GounaVoucherRequestFormBody = {
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      reason: this.formControls.reason.value.trim()
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreateGounaVoucherRequest(formBody))
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
              'Your gouna voucher request'
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

  /**
   * @description initiate Gouna Voucher request form 
   */

  private _initForm() {
    this.gounaVoucherForm = this._formBuilder.group({
      targetOrganizationEmail: [
        '',
        [Validators.required,
        this._validationService.validateSpacesInBetween(),
        this._validationService.whiteSpacesOnlyValidation()],
      ],
      reason: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]],
    });
    this.formControls = provideReactiveFormGetters(this.gounaVoucherForm, '');
  }


 
  /**
   * @description Apply the debouching functionality on the employeesTypeAhead
   * and check if there's a value then we should fire the auto complete and if not we will clear it
   */
  private _setupEmployeesNamesAutocomplete() {
    this._employeesTypeAhead$.pipe(debounceTime(500)).subscribe((value) => {
      // If there's no value
      if (!value.trim().length) {
        this._fireClearAutocomplete();
        return;
      }
      else {
        this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete(value)).subscribe(() => {
          //if there's no matched employee name
          if (!this.employeesList.length) {
            this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail)
          }
        })
      }
    });
  }

}
