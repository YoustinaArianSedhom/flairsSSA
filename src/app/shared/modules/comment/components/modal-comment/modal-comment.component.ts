import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import { CommentService } from '../../models/comment.service';
import * as COMMENT_MODELS from '../../models/comment.models'
import { map } from 'rxjs/operators';
@Component({
  selector: 'ssa-modal-comment',
  templateUrl: './modal-comment.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ModalCommentComponent implements OnInit {
  public formControls: { [control: string]: AbstractControl | FormControl };
  public commentForm: FormGroup;
  public record: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: {
      record: any,
      commentMaxLength: number
    },
    private _formBuilder: FormBuilder,
    private _snackbarService: SnackBarsService,
    private _dialogRef: MatDialogRef<ModalCommentComponent>,
    private _mainService: CommentService
  ) { 
    this.record = this.config.record;
  }

  ngOnInit(): void {
    console.log(this.record);
    this._initForm();
  }

  public cancel(){
    this._dialogRef.close();
  }

  public submit(){
    this._mainService.addCommentOnRequest(this.commentForm.value).subscribe((res: COMMENT_MODELS.CommentResponseModel)=>{
      this.successMessage()
      this._dialogRef.close();
    })
   
  }

  private successMessage(){
    this._snackbarService.openSuccessSnackbar({
      message: SSAConfigInst.CRUD_CONFIG.successMessages.submitted("Your comment"),
      duration: 5,
      showCloseBtn: false
    });
  }

  private _initForm(){
    this.commentForm = this._formBuilder.group({
      requestId: [this.record?.id],
      commentBody: [{value: '', disabled: false}, [Validators.maxLength(this.config.commentMaxLength), Validators.pattern(/^$|.*\S+.*/)]],
    });
    this.formControls = provideReactiveFormGetters(this.commentForm, '');

  }
}
