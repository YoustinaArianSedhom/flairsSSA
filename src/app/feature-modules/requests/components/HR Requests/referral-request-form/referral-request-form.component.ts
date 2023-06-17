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
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationService } from '@shared/modules/validation/validation.service';

@Component({
  selector: 'ssa-referral-request-form',
  templateUrl: './referral-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ReferralRequestFormComponent implements OnInit, OnDestroy {

  @ViewSelectSnapshot(RequestsStateSelectors.allEmployeesList) public referrersList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];

  @ViewSelectSnapshot(RequestsStateSelectors.entityNameReferralRequest) public entityName: string;

  @ViewSelectSnapshot(RequestsStateSelectors.refereesList) public refereesList: REQUESTS_MODELS.EmployeesListAutocompleteModel[];



  public referralRequestForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public amountList: number[] = [500, 1000, 1500, 2000, 2500, 3000,3500,4000,4500,5000,5500,6000];
  public refereeIsNotFound: boolean = true;
  private _referrersTypeAhead$ = new Subject<string>();
  private _refereesTypeAhead$ = new Subject<string>();

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _dialogRef: MatDialogRef<ReferralRequestFormComponent>,
    private _snackbarService: SnackBarsService,
    private _validationService: ValidationService
  ) {
    this._initForm();
  }

  /* ____________________________________________ ACTIONS TRIGGERS _________________________________________________*/
  @Dispatch() private _fireClearReferrersAutocomplete() {
    return new REQUESTS_ACTIONS.ClearAllEmployeesListAutocomplete();
  }

  @Dispatch() private _fireClearRefereesAutocomplete() {
    return new REQUESTS_ACTIONS.ClearRefereesAutoComplete();
  }

  @Dispatch() private _fireClearEntitiesList() {
    return new REQUESTS_ACTIONS.ClearEntitiesListReferralRequest();
  }

  ngOnInit(): void {
    this._setUpReferrersAutocomplete();
    this._setUpRefereesAutocomplete();
  }



  /*_______________________________________________Referrers AUTO COMPLETE PROCESS_______________________________________________*/
  public onFocusReferrersAutocomplete() {
    if (!this.formControls.targetOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete('.'))
  }

  public fireReferrersAutocomplete() {
    this._referrersTypeAhead$.next(
      this.formControls.targetOrganizationEmail.value
    )
  }

   /*________________________________________________TRIGGER ENTITY INFO_______________________________________________________*/

   public onSelectReferrer(employeeEmail: string) {
    this._store
      .dispatch(new REQUESTS_ACTIONS.GetEntityInfoReferralRequest(employeeEmail)).subscribe(
        () => { },

        // Error handling
        (e: HttpErrorResponse) => {
          if (e.error.errorMessage) this._resetFromToDefaults();
        },

        // Complete Handling
        () => {
          this._patchFormValues(this._store.selectSnapshot(RequestsStateSelectors.entityInfoReferralRequest));
          this._fireClearReferrersAutocomplete();
        });
  }

  /*_______________________________________________Referees AUTO COMPLETE PROCESS_______________________________________________*/
  public onFocusRefereesAutocomplete() {
    if (!this.formControls.refereeOrganizationEmail.dirty)
      this._store.dispatch(new REQUESTS_ACTIONS.RefereesAutoComplete('.'))
  }

  public fireRefereesAutocomplete() {
    this._refereesTypeAhead$.next(
      this.formControls.refereeOrganizationEmail.value
    )
  }

  public onSelectReferee() {
    this._fireClearRefereesAutocomplete();
    this.refereeIsNotFound = false;
  }

  /* ________________________________________________ FORM ACTIONS ________________________________________________*/

  public submit() {
    const formBody: REQUESTS_MODELS.ReferralRequestFormBodyModel = {
      ...this.referralRequestForm.getRawValue(),
      targetOrganizationEmail: this.formControls.targetOrganizationEmail.value.trim(),
      refereeOrganizationEmail: this.formControls.refereeOrganizationEmail.value.trim()
    };
    if (formBody.targetOrganizationEmail === formBody.refereeOrganizationEmail) return this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.duplicatedReferrerAndReferee)
    this._store
      .dispatch(new REQUESTS_ACTIONS.CreateReferralRequest(formBody))
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
              'Your referral bonus request'
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


  ngOnDestroy() {
    this._fireClearRefereesAutocomplete();
    this._fireClearReferrersAutocomplete();
    this._fireClearEntitiesList();
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
    this.referralRequestForm = this._formBuilder.group({
      entityName: [{ value: '', disabled: true }, Validators.required],
      entityId: ['', Validators.required],
      targetOrganizationEmail: [
        '',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ],
      ],
      refereeOrganizationEmail: ['',
        [
          Validators.required,
          this._validationService.validateSpacesInBetween(),
          this._validationService.whiteSpacesOnlyValidation()
        ]
      ],
      amount: ['', Validators.required]
    })
    this.formControls = provideReactiveFormGetters(this.referralRequestForm, '');
  }

  private _patchFormValues(
    entity: REQUESTS_MODELS.EntityInfoReferralFormModel
  ) {
    this.referralRequestForm.patchValue({
      ...entity,
    })
    this.formControls.entityName.enable();
  }
  /*
  * @description reset all entities values to their default values
  */
  private _resetFormFields() {
    this.formControls.entityName.reset({ value: '', disabled: true })
    this.formControls.entityId.setValue('');
    this.formControls.refereeOrganizationEmail.setValue('');
    this.formControls.amount.setValue('');
  }


  /**
   * @description clear all data in the form, entity list and auto complete employees list
   */
  private _resetFromToDefaults() {
    this._resetFormFields();
    this._fireClearEntitiesList();
    this._fireClearReferrersAutocomplete();
    this._fireClearRefereesAutocomplete();
  }



  private _setUpReferrersAutocomplete() {
    this._referrersTypeAhead$.pipe(

      debounceTime(500)).subscribe((value) => {
        // If there's no value
        if (!value.trim().length) {
          this._resetFromToDefaults();
        }
        else {
          this._store.dispatch(new REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete(value)).subscribe(() => {
            //if there's no matched employee name
            if (!this.referrersList.length) {
              this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.referrerEmail)
              this._resetFromToDefaults();
            }
          })
        }
      });
  }




  private _setUpRefereesAutocomplete() {
    this._refereesTypeAhead$
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        // If there's no value
        if (!value.trim().length) {
          this._fireClearRefereesAutocomplete();
          this.refereeIsNotFound = true;
        } else this._store.dispatch(new REQUESTS_ACTIONS.RefereesAutoComplete(value)).subscribe(() => {
          if (!this.refereesList.length) {
            this._openFailureSnackbar(REQUESTS_CONFIGS.SNACKBAR_ERROR_MESSAGES.refereeEmail);
            this._fireClearRefereesAutocomplete();
            this.refereeIsNotFound = true;
            return;
          }
          this.refereeIsNotFound = false;
        }
        );
      });
  }






}
