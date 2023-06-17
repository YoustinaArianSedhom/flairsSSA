import { MatDialog } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import * as MY_REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import * as MY_REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import { Router } from '@angular/router';
import * as ALL_LEAVE_ACTIONS from '@modules/all-leave/state/actions/all-leave.actions'
import { ArchiveDeleteComponent } from '@shared/components/archive-delete/archive-delete.component';

@Component({
  selector: 'ssa-card-request',
  templateUrl: './card-request.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardRequestsComponent {

  @Input() public record: MY_REQUESTS_MODELS.MyRequestModel;
  @Input() public pagination: PaginationConfigModel;
  @Input() public cardType: string;


  public requestStatusesEnum: typeof MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM = MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM;
  public requestType = SSAConfigInst.REQUEST_TYPES_CONFIG;

  constructor(
    private _modals: ModalsService,
    private _snackbars: SnackBarsService,
    private _store: Store,
    private _router: Router,
    private _matDialog: MatDialog
  ) { }

  // => [code-review-loai] Did you think about creating a service that resolve the duplication between the following methods 
  // and the same methods on table-requests !
  // why you give this component the control of firing actions and dealing with state, why you didn't use the wrapper for that ?
  public deleteRequest(record: MY_REQUESTS_MODELS.MyRequestModel) {
    const getMatDialogData = this._matDialog.open(
      ArchiveDeleteComponent, {
      data: {
        action: 'Delete',
        record
      },
      panelClass: ['form-dialog--medium']
    }
    )
    getMatDialogData.afterClosed().subscribe((res) => {
      if (res?.choiceNote) {
        this._store.dispatch(new MY_REQUESTS_ACTIONS.DeleteMyRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.deleted('Request-' + record.readableId),
        }))
      }
    })
  }

  public archiveRequest(record: MY_REQUESTS_MODELS.MyRequestModel) {
    const getMatDialogData = this._matDialog.open(
      ArchiveDeleteComponent, {
      data: {
        action: 'Archive',
        record
      },
      panelClass: ['form-dialog--medium']
    }
    )
    getMatDialogData.afterClosed().subscribe((res) => {
      if (res?.choiceNote) {
        this._store.dispatch(new ALL_LEAVE_ACTIONS.ArchiveRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.archived('Request-' + record.readableId),
        }))
      }
    })
  }

  openRequestDetails(record: MY_REQUESTS_MODELS.MyRequestModel) {
    this._router.navigate([{
      outlets: {
        'side-panel': ['request-details', record.id],
      }
    }], {
      queryParams: {
        type: record.workflowType
      }
    })
  }

}
