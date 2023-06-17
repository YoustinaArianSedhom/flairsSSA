import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCommentComponent } from './components/modal-comment/modal-comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { ModalsModule } from '../modals/modals.module';
import { ValidationModule } from '../validation/validation.module';

@NgModule({
  declarations: [
    ModalCommentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ModalsModule,
    ValidationModule
  ],
  exports: [ModalCommentComponent]
})
export class CommentModule { }
