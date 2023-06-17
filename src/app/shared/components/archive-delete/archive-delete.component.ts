import { SnackBarsService } from './../../modules/snackbars/snackbars.service';
import { SSAConfigInst } from './../../../config/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';
import { Store } from '@ngxs/store';
import * as ALL_REQUESTS_ACTIONS from '@modules/all-requests/state/all-requests.actions';
import * as ALL_LEAVE_ACTIONS from '@modules/all-leave/state/actions/all-leave.actions';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';

@Component({
  selector: 'ssa-archive-delete',
  templateUrl: './archive-delete.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ArchiveDeleteComponent implements OnInit {

  public archiveOrDeleteModalForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      action: string,
      record: ALL_REQUESTS_MODELS.AllRequestModel
    },
    private _dialogRef: MatDialogRef<ArchiveDeleteComponent>,
    private _fb: FormBuilder,
    private _store: Store,
    private _snackbars: SnackBarsService
  ) { }

  ngOnInit(): void {
    this._initeForm()
  }

  public onClose() {
    this._dialogRef.close();
  }

  public onSubmit() {
    this._dialogRef.close({choiceNote: this.formControls.instanceNote.value});
  }


  private _initeForm() {
    this.archiveOrDeleteModalForm = this._fb.group({
      instanceNote: ["", Validators.required]
    })
    this.formControls = provideReactiveFormGetters(this.archiveOrDeleteModalForm, '');
  }

}
