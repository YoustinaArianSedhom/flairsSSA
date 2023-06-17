import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Observable, Subject,Subscription } from 'rxjs';
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
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationService } from '@shared/modules/validation/validation.service';

@Component({
  selector: 'ssa-change-manager-request-form',
  templateUrl: './change-manager-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ChangeManagerRequestFormComponent implements OnInit, OnDestroy {



  @ViewSelectSnapshot(RequestsStateSelectors.mySubsEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.managersList) public managersList: REQUESTS_MODELS.ManagersListAutocompleteModel[];

  public changeManagerRequestForm: FormGroup
  public formControls: { [control: string]: AbstractControl | FormControl };
  public dateConfig: { min: Date, max: Date } = {
    min: new Date(),
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 2))
  }
  public selectedEmployee: REQUESTS_MODELS.EmployeesListAutocompleteModel;
  public selectedManager: REQUESTS_MODELS.ManagersListAutocompleteModel;

  public employeeIsNotFound: boolean = true;
  public managerIsNotFound: boolean = true;

  public filteredTenroxGroups: Observable<string[]>
  private _managersTypeAhead$ = new Subject<string>();
  private _employeesTypeAhead$ = new Subject<string>();
  private _removeDataOfSelectedEmployee: Subscription;
  private _removeDataOfSelectedManager: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _dialogRef: MatDialogRef<ChangeManagerRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _validationService: ValidationService
  ) {
    this._initForm()
  }
  /* _______________________________________________ ACTIONS TRIGGERS ________________________________________________________  */
  @Dispatch() private _fireClearEmployeesAutocomplete() {
    return new REQUESTS_ACTIONS.ClearMySubsEmployeeAutoComplete();
  }

  @Dispatch() private _fireClearManagersAutocomplete() {
    return new REQUESTS_ACTIONS.ClearManagersAutoComplete();
  }

  /**
   * @description to open a failure snackbar if there's a failed step in the process
   * @param message string value represent the message that would be displayed 
   */

  ngOnInit(): void {
    this._setupEmployeesAutocomplete();
    this._setupManagersAutocomplete();
    this._removeDataOfSelectedEmployee = this.changeManagerRequestForm.get("targetOrganizationEmail").valueChanges.subscribe((val) => {
      if (!val) {
        this.selectedEmployee = null;
      }
    })
    this._removeDataOfSelectedManager = this.changeManagerRequestForm.get("newManagerOrganizationEmail").valueChanges.subscribe((val) => {
      if (!val) {
        this.selectedManager = null;
      }
    })

  }

  /*_______________________________________________Employees AUTO COMPLETE PROCESS_______________________________________________*/
  public onFocusEmployeesAutocomplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete("."))
  }

  public fireEmployeesAutocomplete() {
    this._employeesTypeAhead$.next(
      this.formControls.targetOrganizationEmail.value
    )
  }

  public onSelectEmployee(employeeEmail: string) {
    this.selectedEmployee = this.employeesList.find(emp => emp.organizationEmail === employeeEmail);
    this._fireClearEmployeesAutocomplete();
    this.employeeIsNotFound = false;
  }
  /*___________________________________Managers Auto Complete__________________________________*/
  public onFocusManagersAutocomplete() {
    if (!this.formControls.newManagerOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.ManagersAutoComplete("."))
  }


  public fireManagersAutocomplete() {
    this._managersTypeAhead$.next(
      this.formControls.newManagerOrganizationEmail.value
    )
  }

  public onSelectNewManager(managerEmail) {
    this.selectedManager = this.managersList.find(emp => emp.organizationEmail === managerEmail);
    this._fireClearManagersAutocomplete();
    this.managerIsNotFound = false;
  }

  /*_______________FORM ACTIONS_____________*/
  public submit() {
    const body: REQUESTS_MODELS.ChangeManagerRequestFormBodyModel = {
      ...this.changeManagerRequestForm.getRawValue(),
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      newManagerOrganizationEmail: this.formControls.newManagerOrganizationEmail.value.trim(),
      effectiveStartDate: this.formControls.effectiveStartDate.value.toLocaleDateString('en-US'),
      instanceNote: this.formControls.instanceNote?.value.trim(),
    };
    if (body.targetOrganizationEmail === body.newManagerOrganizationEmail) return this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.duplicatedMangerAndEmployeeEmail)
    this._store.dispatch(new REQUESTS_ACTIONS.CreateChangeManagerRequest(body)).subscribe(
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
            'Your change management request'
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
    this._fireClearEmployeesAutocomplete();
    this._fireClearManagersAutocomplete();
    this._removeDataOfSelectedEmployee.unsubscribe();
    this._removeDataOfSelectedManager.unsubscribe();
  }

  private _openFailureSnackbar(message: string) {
    this._snackbarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false
    });
  }



  /*____________________________________________FORM INITIATION AND OPERATIONS______________________________________________________*/

  /**
   * @description initiate change Manager request form 
   */
  private _initForm() {
    this.changeManagerRequestForm = this._formBuilder.group({
      targetOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ],
      ],
      newManagerOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ]
      ],

      effectiveStartDate: ['', Validators.required],
      instanceNote: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]]
    })
    this.formControls = provideReactiveFormGetters(this.changeManagerRequestForm, '');
  }

  /**
   * @description filter the tenrox team list according to the value user typed
   * @param value value that user typed
   * @returns an array that includes only filtered items
   */




  private _setupEmployeesAutocomplete() {
    this._employeesTypeAhead$
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        // If there's no value
        if (!value.trim().length) {
          this._fireClearEmployeesAutocomplete();
          this.employeeIsNotFound = true
        } else this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete(value)).subscribe(() => {
          if (!this.employeesList.length) {
            this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail)
            this._fireClearEmployeesAutocomplete();
            this.employeeIsNotFound = true;
            return;
          }
          this.employeeIsNotFound = false
        }
        );
      });
  }

  private _setupManagersAutocomplete() {
    this._managersTypeAhead$
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        // If there's no value
        if (!value.trim().length) {
          this._fireClearManagersAutocomplete();
          this.managerIsNotFound = true
        } else this._store.dispatch(new REQUESTS_ACTIONS.ManagersAutoComplete(value)).subscribe(() => {
          if (!this.managersList.length) {
            this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.managerEmail)
            this._fireClearManagersAutocomplete();
            this.managerIsNotFound = true;
            return;
          }
          this.managerIsNotFound = false
        }
        );
      });
  }




}
