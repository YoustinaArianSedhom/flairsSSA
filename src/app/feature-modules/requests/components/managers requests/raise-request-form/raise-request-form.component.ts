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
import animations from '@modules/requests/components/managers requests/raise-request-form/raise-request-form.animation';

@Component({
  selector: 'ssa-raise-request-form',
  templateUrl: './raise-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations
})
export class RaiseRequestFormComponent implements OnInit, OnDestroy {
  @ViewSelectSnapshot(RequestsStateSelectors.mySubsEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.entityNameRaiseRequest) public entityName: string;
  @ViewSelectSnapshot(RequestsStateSelectors.raiseReasons) public raiseReasons: string[];
  
  
  
  
  public formControls: { [control: string]: AbstractControl | FormControl };
  public raiseForm: FormGroup;
  public selectedEmployee: REQUESTS_MODELS.EmployeesListAutocompleteModel;
  private _employeesTypeAhead$ = new Subject<string>();
  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<RaiseRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }

 /* ____________________________________________ ACTIONS TRIGGERS _________________________________________________*/
 @Dispatch() private _fireClearAutocomplete() {
  return new REQUESTS_ACTIONS.ClearMySubsEmployeeAutoComplete();
}

@Dispatch() private _fireClearEntitiesList() {
  return new REQUESTS_ACTIONS.ClearEntitiesListRaiseRequest();
}

@Dispatch() private _fireGetRaiseReasons() {
  return new REQUESTS_ACTIONS.GetRaiseReasons();
}


  ngOnInit(): void {
    this._setupEmployeesNamesAutocomplete();
    this._onChangeNewGrossSalaryValue();
    this._fireGetRaiseReasons()
  }

  
  /* __________________________________________________ AUTO COMPLETE _______________________________________________________*/

  /**
   * @description open all sub employees once the employee name field is on focus
   */
   public onFocusAutoComplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete("."))
  }

   /*________________________________________________TRIGGER ENTITY INFO_______________________________________________________*/

   public onSelectEmployeeEmail(employeeEmail: string) {
    this.selectedEmployee = this.employeesList.find(emp=> emp.organizationEmail === employeeEmail);
    this._store
      .dispatch(new REQUESTS_ACTIONS.GetEntityInfoRaiseRequest(employeeEmail)).subscribe(
        () => { },

        // Error handling
        (e: HttpErrorResponse) => {
          if (e.error.errorMessage) this._resetFromToDefaults()
        },

        // Complete Handling
        () => {
          this._patchFormValues(this._store.selectSnapshot(RequestsStateSelectors.entityInfoRaiseRequest));
          this._fireClearAutocomplete();
        });
  }

  /**
   * @summary Emit new value to employees Autocomplete stream
   */
  public fireAutocomplete() {
    this._employeesTypeAhead$.next(this.formControls.targetOrganizationEmail.value);
  }

   /* ________________________________________________ FORM ACTIONS ________________________________________________*/

   public submit() {
    const formBody: REQUESTS_MODELS.RaiseRequestBodyModel = {
      ...this.raiseForm.getRawValue(),
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      note: this.formControls.note.value.trim()
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreateRaiseRequest(formBody))
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
              'Your raise request'
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
    this._fireClearEntitiesList();
  }

    private _openFailureSnackbar(message: string) {
      this._snackbarService.openFailureSnackbar({
        message,
        duration: 5,
        showCloseBtn: false
      });
    }
  
  /* ____________________________________________ FORM OPERATIONS _____________________________________________________*/

  /**
   * @description initiate raise request form 
   */
  private _initForm() {
    this.raiseForm = this._formBuilder.group({
      targetOrganizationEmail: [
        '',
        [Validators.required,
        this._validationService.validateSpacesInBetween(),
        this._validationService.whiteSpacesOnlyValidation()],
      ],
      entityName: [{ value: '', disabled: true }, Validators.required],
      entityId: ['', Validators.required],
      currentJobId: ['', Validators.required],
      currentJobName: ['', Validators.required],
      raiseReason: ['', Validators.required],
      currentLevelId: ['', Validators.required],
      currentLevelName: ['', Validators.required],
      salaryLevelFrom: [null, Validators.required],
      salaryLevelTo: [null, Validators.required],
      monthlyPersonalExemptionAmount: [null, Validators.required],
      monthlyBaseSocialInsurance: [null, Validators.required],
      oldGrossSalary: [null, Validators.required],
      oldNetSalary: [null, Validators.required],
      newGrossSalary: [{ value: null, disabled: true },
      [
        Validators.min(1),
        Validators.max(9999999),
        this._validationService.positiveDoubleValidator(),
        Validators.required
      ]
      ],
      newNetSalary: [null, Validators.required],
      note: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]],
    });
    this.formControls = provideReactiveFormGetters(this.raiseForm, '');
  }

  private _patchFormValues(
    entity: REQUESTS_MODELS.EntityInfoRaiseFormModel
  ) {
    this.raiseForm.patchValue({
      ...entity,
      newGrossSalary: null,
      newNetSalary: null,
    });
    this.formControls.entityName.enable();
    this.formControls.newGrossSalary.enable();
  }

  private _patchNetSalary(newNetSalary: number) {
    this.raiseForm.patchValue({ newNetSalary });
  }

  /**
   * @description reset new net salary value
   */
  private _resetNetSalary() {
    this.raiseForm.patchValue({
      newNetSalary: null,
    });
  }

  /**
   * @description reset all form values to their default values except email, department and note
   */
  private _resetFormValues() {
    this.raiseForm.reset({
      targetOrganizationEmail: this.raiseForm.get('targetOrganizationEmail').value,
      entityName: { value: '', disabled: true },
      newGrossSalary: { value: null, disabled: true },
      note: this.raiseForm.get('note').value
    })
    this.raiseForm.get('targetOrganizationEmail').markAsDirty();
    this.selectedEmployee = null;
  }


  /**
   * @description clear all data in the form, entity list and auto complete employees list
   */
  private _resetFromToDefaults() {
    this._resetFormValues();
    this._fireClearEntitiesList();
    this._fireClearAutocomplete();
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
      }
      else {
        this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete(value)).subscribe(() => {
          //if there's no matched employee name
          if (!this.employeesList.length) {
            this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail)
            this._resetFromToDefaults();
          }
        })
      }
    });
  }
 

  /*________________________________________________to get new net salary________________________________________*/
  private _setNetSalaryBody(): REQUESTS_MODELS.NewNetSalaryConfigModel {
    return this.raiseForm.getRawValue();
  }

  /**
   * @description to get new net salary value
   */
  private _getNewNetSalary() {
    const netSalaryBody: REQUESTS_MODELS.NewNetSalaryConfigModel = this._setNetSalaryBody();
    this._store
      .dispatch(new REQUESTS_ACTIONS.GetNewNetSalary(netSalaryBody))
      .subscribe(() => { }, () => { }, () => {
        this._patchNetSalary(
          this._store.selectSnapshot(RequestsStateSelectors.newNetSalary)
        )
        if (+this.formControls.newNetSalary.value < 0) {
          this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.newNetSalary)
        };
      })
  }

  private _onChangeNewGrossSalaryValue() {
    this.formControls.newGrossSalary.valueChanges
      .pipe(debounceTime(1500))
      .subscribe((value) => {
        //if there's no value or invalid value
        if (value === null || this.formControls.newGrossSalary.invalid) {
          this._resetNetSalary();
          return;
        }
        //only if new gross salary is valid
        if (this.formControls.newGrossSalary.valid) {
          //get new monthly base social insurance first
         
          this._getNewNetSalary();
        }
      });
  }

}
