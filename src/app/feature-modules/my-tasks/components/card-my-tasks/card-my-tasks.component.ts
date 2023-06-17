import { Component, EventEmitter, Output, Input } from '@angular/core';

import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';


import * as MY_TASKS_MODELS from '@modules/my-tasks/models/my-tasks.model';
import * as MY_TASKS_ACTIONS from '@modules/my-tasks/state/my-tasks.actions';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Router } from '@angular/router';
import { MyTasksService } from '@modules/my-tasks/models/my-tasks.service';
import { InjectableFormComponent } from '../injectable-form/injectable-form.component';
import { SuccessSnackbar } from '@modules/my-tasks/models/my-tasks.config';
import { getPanelClasses } from '@shared/modules/modals/model/modals.model';
import { ModalCommentComponent } from '@shared/modules/comment/components/modal-comment/modal-comment.component';


@Component({
  selector: 'ssa-card-my-tasks',
  templateUrl: './card-my-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardMyTasksComponent {
  @Input() public record: MY_TASKS_MODELS.MyTasksModel;
  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter();
  public requestType = SSAConfigInst.REQUEST_TYPES_CONFIG
  constructor(
    private _store: Store,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private _myTasksService: MyTasksService,
    private _matDialog: MatDialog) {
  }


  


  public takeAnAction(record: MY_TASKS_MODELS.MyTasksModel, action: MY_TASKS_MODELS.AvailableChoicesModel) {
  
    const takeActionParameter: MY_TASKS_MODELS.ActionConfigsModel = {
      requestId: record.id,
      choice:action.identifier
    }
    console.log(takeActionParameter)


    this._myTasksService.getInjectableComponents(takeActionParameter).subscribe(
      (res: MY_TASKS_MODELS.InjectableDataModel[]) => {
        if (!res.length) {
          this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionOnTask(takeActionParameter)).subscribe(() => {
            this._snackbarService.openSuccessSnackbar({
              message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
              duration: 5,
              showCloseBtn: false
            })
          })
          return;
        }

        this._matDialog.open(InjectableFormComponent, {
          data: {
            action: action.identifier,
            record,
            injectedFields: res
          },
          panelClass: getPanelClasses(action.identifier)
        })
      }
    )
  }


  public viewDetails(record: MY_TASKS_MODELS.MyTasksModel) {
    this._router.navigate([{
      outlets: { 'side-panel': ['request-details', record.id] }
    }], { queryParams: { type: record.workflowType } })
  }

  public openCommentComponent(record: MY_TASKS_MODELS.MyTasksModel) {
    this._matDialog.open(ModalCommentComponent, {
      data: {
        record,
        commentMaxLength: 800
      },
      panelClass: getPanelClasses('ADD_COMMENT')
    })
  }
}
