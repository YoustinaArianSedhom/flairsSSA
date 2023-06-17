import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
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
import animations from '@modules/requests/components/managers requests/promotion-request-form/promotion-request-form-animation'

@Component({
  selector: 'ssa-promotion-request-form',
  templateUrl: './promotion-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations
})
export class PromotionRequestFormComponent implements OnInit, OnDestroy {
  
  

  @ViewSelectSnapshot(RequestsStateSelectors.promotionJobsList) public promotionJobsList: REQUESTS_MODELS.PromotionJobModel[];
  @ViewSelectSnapshot(RequestsStateSelectors.mySubsEmployeesList) public employeesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];

  @ViewSelectSnapshot(RequestsStateSelectors.entityNamePromotionRequest) public entityName: string;

  
  
  public promotionLevelsList: REQUESTS_MODELS.PromotionLevelModel[]
  public promotionForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public selectedEmployee: REQUESTS_MODELS.EmployeesListAutocompleteModel;
  private _employeesTypeAhead$ = new Subject<string>();
  
  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _dialogRef: MatDialogRef<PromotionRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }
  /* ______________________ ACTIONS TRIGGERS ____________________  */
  @Dispatch() private _fireClearAutocomplete() {
    return new REQUESTS_ACTIONS.ClearMySubsEmployeeAutoComplete();
  }
  @Dispatch() private _fireClearEntitiesList() {
    return new REQUESTS_ACTIONS.ClearEntitiesListPromotionRequest();
  }


  ngOnInit(): void {
    this._setupEmployeesNamesAutocomplete();
    this._store.dispatch(new REQUESTS_ACTIONS.GetPromotedJobsList());
  }

   /*____________________________________________________AUTO COMPLETE PROCESS___________________________________________________________*/

  /**
   * @description open all sub employees once the employee name field is on focus
   */
   public onFocusAutoComplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete("."))
  }

  public fireAutocomplete() {
    this._employeesTypeAhead$.next(
      this.promotionForm.get('targetOrganizationEmail').value
    );
  }

  
  public onSelectEmployeeEmail(employeeEmail: string) {
    this.selectedEmployee = this.employeesList.find(emp=> emp.organizationEmail === employeeEmail);
    this._store
      .dispatch(new REQUESTS_ACTIONS.GetEntityInfoPromotionRequest(employeeEmail))
      .subscribe(
        () => { },
        ((e: HttpErrorResponse) => {
          if (e.error.errorMessage) {
            this._resetFormToDefaults()
          }
        }),
        () => {
          this._fireClearAutocomplete();
          this._getEmployeeInfo(employeeEmail)
        }
      );
  }

  public onSelectPromotionJob(id: number) {
    const selectedJob = this.promotionJobsList.filter((job) => {
      return job.id === id
    })[0]
    this.promotionLevelsList = selectedJob.levels
    this.formControls.promotionJobName.setValue(selectedJob.function)
  }



  public onSelectPromotionLevel(id: string) {
    const selectedLevel = this.promotionLevelsList.filter((level) => {
      return level.id === id
    })[0]
    this.formControls.promotionLevelName.setValue(selectedLevel.name)
    this.formControls.promotionLevelDescription.setValue(selectedLevel.description)
  }

  /*_______________FORM ACTIONS_____________*/
  submit() {
    const body: REQUESTS_MODELS.PromotionRequestBodyModel = {
      ...this.promotionForm.getRawValue(),
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      note: this.formControls.note.value.trim(),
    };
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreatePromotionRequest(body))
      .subscribe(
        () => { },
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
              'Your promotion request'
            ),
            duration: 5,
            showCloseBtn: false,
          });
          this._dialogRef.close();
        });
  }
  cancel() {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._fireClearAutocomplete();
    this._fireClearEntitiesList();
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
  /*____________________________________________FORM INITIATION AND OPERATIONS______________________________________________________*/

  /**
   * @description initiate promotion request form 
   */
  private _initForm() {
    this.promotionForm = this._formBuilder.group({
      entityId: ['', Validators.required],
      entityName: [{ value: '', disabled: true }, Validators.required],
      targetOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ],
      ],
      title: ['', [Validators.required,Validators.maxLength(100)]],
      currentLevelId: ['', Validators.required],
      currentLevelName: ['', Validators.required],
      currentLevelDescription: ['', Validators.required],
      currentJobId: ['', Validators.required],
      currentJobName: ['', Validators.required],
      promotionLevelId: ['', Validators.required],
      promotionLevelName: ['', Validators.required],
      promotionLevelDescription: ['', Validators.required],
      promotionJobId: ['', Validators.required],
      promotionJobName: ['', Validators.required],
      note: ['', [Validators.maxLength(1000), Validators.pattern(/^$|.*\S+.*/)]],
    });
    this.formControls = provideReactiveFormGetters(this.promotionForm, '');
  }

  
  private _patchFormValues(
    entity: REQUESTS_MODELS.EntityInfoPromotionFormModel,
    employeeInfo: REQUESTS_MODELS.EmployeeInfoModel
  ) {
    this.promotionForm.patchValue({
      ...entity,
      ...employeeInfo
    });
    this.formControls.entityName.enable();
  }

  /**
   * @description reset all form values to their default values except email, department and note
   */
  private _resetFormValues() {
    this.promotionForm.reset({
      targetOrganizationEmail: this.promotionForm.get('targetOrganizationEmail').value,
      entityName: { value: '', disabled: true },
      note: this.promotionForm.get('note').value
    })
    this.promotionForm.get('targetOrganizationEmail').markAsDirty();
    this.selectedEmployee = null
  }

  /**
   * @description clear all data in the form, entity list and auto complete employees list
   */
  private _resetFormToDefaults() {
    this._resetFormValues();
    this._fireClearEntitiesList();
    this._fireClearAutocomplete();
  }
 

  private _setupEmployeesNamesAutocomplete() {
    this._employeesTypeAhead$
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        // If there's no value
        if (!value.trim().length) {
          this._resetFormToDefaults();
        } else this._store.dispatch(new REQUESTS_ACTIONS.MySubsEmployeesAutoComplete(value)).subscribe(() => {
          if (!this.employeesList.length) {
            this._snackbarService.openFailureSnackbar({
              message: REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.employeeEmail,
              duration: 5,
              showCloseBtn: false
            });
            this._resetFormToDefaults();
          }
        }
        );
      });
  }

  /*______________________________________Form Functionality_________________________________________*/

  private _getEmployeeInfo(employeeEmail: string) {
    this._store.dispatch(new REQUESTS_ACTIONS.GetEmployeeInfoPromotionRequest(employeeEmail)).subscribe(
      () => { },
      () => { },
      () => {
        this._patchFormValues(
          this._store.selectSnapshot(RequestsStateSelectors.entityInfoPromotionRequest),
          this._store.selectSnapshot(RequestsStateSelectors.employeeInfoPromotionRequest)
        );
      }
    )
  }
}
