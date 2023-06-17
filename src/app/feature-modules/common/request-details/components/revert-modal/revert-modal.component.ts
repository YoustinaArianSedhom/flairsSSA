import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';

@Component({
  selector: 'ssa-revert-modal',
  templateUrl: './revert-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class RevertModalComponent implements OnInit {

  public revertModalForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<RevertModalComponent>,
    private _fb: FormBuilder,
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
    this.revertModalForm = this._fb.group({
      instanceNote: ["", Validators.required]
    })
    this.formControls = provideReactiveFormGetters(this.revertModalForm, '');
  }

}
