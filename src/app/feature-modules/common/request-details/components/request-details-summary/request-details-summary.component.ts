import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import { InjectableFormComponent } from '@modules/my-tasks/components/injectable-form/injectable-form.component';
import { MyTasksService } from '@modules/my-tasks/models/my-tasks.service';
import * as MY_TASKS_MODELS from '@modules/my-tasks/models/my-tasks.model';
import * as MY_TASKS_ACTIONS from '@modules/my-tasks/state/my-tasks.actions'
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import * as REQUEST_DETAILS_CONFIGS from '@modules/common/request-details/model/request-details.config';
import { SuccessSnackbar } from '@modules/my-tasks/models/my-tasks.config';
import { getPanelClasses } from '@shared/modules/modals/model/modals.model';

@Component({
  selector: 'ssa-request-details-summary',
  templateUrl: './request-details-summary.component.html',
  styles: [
    `

      :host {
        display: block;
      }
      
      button.action-btn,button.success-btn, button.cancel-btn:not(:last-child) { 
        margin-right:12px
      }
      button.mr-0{margin-right:0;}
    `
  ]
})
export class RequestDetailsSummaryComponent {
  @Input() public requestSummary: REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel | REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel | REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel
  public actionColor = REQUEST_DETAILS_CONFIGS.ACTIONS_BUTTONS_CLASSES;
  constructor(
    private _myTasksService: MyTasksService,
    private _matDialog: MatDialog,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _router: Router,

  ) { }

  // public availableActions: {key:string,value:string}[]


  // ngOnInit(): void {
  // this.availableActions = this.requestSummary.availableChoices?.map((choice) => {
  //   if (choice === 'INJECT_RECIEVER_P2P_DATA') return {key:choice,value:'Complete'}

  //   if (choice === 'INJECT_FINANCE_P2P_DATA') return {key:choice,value:'Apply'}


  //   if (choice === 'INJECT_TENROX_GROUP') return {key:choice,value:'Apply'}


  //   return {key:choice,value:choice.charAt(0).toUpperCase() + choice.slice(1).toLowerCase()};
  // })

  // console.log(this.availableActions)
  // }


  public takeAnAction(action: REQUEST_DETAILS_MODELS.AvailableChoicesModel, id: string) {
    const takeActionParameter = {
      requestId: id,
      choice: action.identifier
    }

    this._myTasksService.getInjectableComponents(takeActionParameter).subscribe(
      (res: MY_TASKS_MODELS.InjectableDataModel[]) => {
        if (!res.length) {
          this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionOnTask(takeActionParameter)).subscribe(() => {
            this._router.navigate([{
              outlets: { 'side-panel': null }
            }])
            this._snackbarService.openSuccessSnackbar({
              message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
              duration: 5,
              showCloseBtn: false
            });
          })
          return;
        }

        // this._matDialog.open(InjectableFormComponent, {
        //   data: {
        //     action: action.key,
        //     record,
        //     injectedFields: res
        //   },
        //   panelClass: ["form-dialog--small"]
        // })
        this._matDialog.open(InjectableFormComponent, {
          data: {
            action: action.identifier,
            record: this.requestSummary,
            injectedFields: res
          },
          panelClass: getPanelClasses(action.identifier)
        }).afterClosed().subscribe((result) => {
          if (result) {
            this._router.navigate([{
              outlets: { 'side-panel': null }
            }])
          }
        })
      }
    )

  }

}
