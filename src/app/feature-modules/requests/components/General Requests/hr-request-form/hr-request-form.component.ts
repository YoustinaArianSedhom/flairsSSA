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

@Component({
  selector: 'ssa-hr-request-form',
  templateUrl: './hr-request-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class HRRequestFormComponent implements OnInit {
  
  public HRRequestForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public letterLanguages = REQUESTS_CONFIGS.HR_REQUEST_LETTER_LANGUAGES_LIST

  constructor(
    private _formBuilder: FormBuilder,
    private _snackbarService: SnackBarsService,
    private _dialogRef: MatDialogRef<HRRequestFormComponent>,
    private _store: Store
  ) {
    this._initForm()
  }
  


  ngOnInit(): void {
    this._store.dispatch(new REQUESTS_ACTIONS.GetMyUserInfo()).subscribe(() => { }, () => { }, () => {
      this._patchNameAndTitle(this._store.selectSnapshot(RequestsStateSelectors.userInfo))
    })
  }

  /*________________________________________________________Form Actions___________________________________________________*/
  public submit() {
    const body: REQUESTS_MODELS.HRRequestFormBodyModel = { 
      ...this.HRRequestForm.getRawValue(),
      fullName:this.formControls.fullName.value.trim(),
      title:this.formControls.title.value.trim(),
      toWhomItMayConcern:this.formControls.toWhomItMayConcern.value.trim()
     }
    this._store.dispatch(new REQUESTS_ACTIONS.CreateHRRequest(body)).subscribe(() => { }, () => { }, () => {
      this._snackbarService.openSuccessSnackbar({
        message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
          'Your HR letter request'
        ),
        duration: 5,
        showCloseBtn: false,
      });
      this._dialogRef.close();
    })
  }

  public cancel() {
    this._dialogRef.close();
  }
  
  /*________________________________________________Form Initiation and Operations _________________________________________________*/
  /**
   * @description initiate HR request form 
   */

  private _initForm() {
    this.HRRequestForm = this._formBuilder.group({
      fullName: ["", [Validators.required, Validators.maxLength(150), Validators.pattern(/^$|.*\S+.*/)]],
      title: ["", [Validators.required, Validators.maxLength(150), Validators.pattern(/^$|.*\S+.*/)]],
      language: ["", [Validators.required]],
      toWhomItMayConcern: ["", [Validators.required, Validators.maxLength(150), Validators.pattern(/^$|.*\S+.*/)]],
      grossSalaryIncluded: [false]
    })
    this.formControls = provideReactiveFormGetters(this.HRRequestForm, '');
  }

  /**
   * @description patch form values (name and title) with passed  info
   * @param info user info (name and title)
   */

  private _patchNameAndTitle(info: REQUESTS_MODELS.UserInfoModel) {
    this.HRRequestForm.patchValue({
      fullName: info.fullName,
      title: info.title
    })
  }
}
