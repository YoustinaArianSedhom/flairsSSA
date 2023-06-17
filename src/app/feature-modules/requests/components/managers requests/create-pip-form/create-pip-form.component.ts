import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { SSAConfigInst } from 'src/app/config/app.config';
@Component({
  selector: 'ssa-create-pip-form',
  templateUrl: './create-pip-form.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CreatePipFormComponent implements OnInit {
  public pipForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };

  constructor(
    private _dialogRef: MatDialogRef<CreatePipFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) { }

  ngOnInit(): void {
    this._initForm();

  }


  public cancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(): void {
    this._store.dispatch(new MY_REQUESTS_ACTIONS.CreateNewPIPRequest(this.pipForm.value)).subscribe(
      ()=>{},
      ()=>{},
      ()=>{
        this._snackbarService.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.created(
            `PIP request`
          ),
          duration: 5,
          showCloseBtn: false,
        });
        this._dialogRef.close();
      }
    )

  }
  onEmployeeSelect(employee: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel): void {
    employee ? this.formControls.targetOrganizationEmail.setValue(employee.organizationEmail) : this.formControls.targetOrganizationEmail.setValue(null)
  }

  public checkValidity(val, controlName: string): void {

    if (val.value.trim() === '') {
      if (controlName !== 'targetOrganizationEmail') {
        this.formControls[controlName].setValue('')
      }
      this.formControls[controlName].markAsTouched()
    }
  }

  private _initForm(): void {
    this.pipForm = this._formBuilder.group({
      targetOrganizationEmail: ['', [Validators.required]],
      note: ['']
    });
    this.formControls = provideReactiveFormGetters(this.pipForm,'')
  }

}
