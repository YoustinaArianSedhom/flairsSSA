import { MatDialog } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';
import { Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SSAConfigInst } from 'src/app/config/app.config';
import * as ALL_REQUESTS_ACTIONS from '@modules/all-requests/state/all-requests.actions';
import * as ALL_REQUESTS_CONFIG from '@modules/all-requests/models/all-requests.config';
import { ArchiveDeleteComponent } from '@shared/components/archive-delete/archive-delete.component';

@Component({
  selector: 'ssa-all-requests-card-request',
  templateUrl: './all-requests-card-request.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AllRequestsCardRequestComponent {

  @Input() public record: ALL_REQUESTS_MODELS.AllRequestModel;
  @Input() public pagination: PaginationConfigModel;

  public requestStatusesEnum: typeof ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM = ALL_REQUESTS_CONFIG.ALL_REQUESTS_STATUSES_ENUM;
  public requestType = SSAConfigInst.REQUEST_TYPES_CONFIG;
  constructor(
    private _modals: ModalsService,
    private _snackbars: SnackBarsService,
    private _store: Store,
    private _router: Router,
    private _matDialog:MatDialog
  ) { }


  public archiveRequest(record: ALL_REQUESTS_MODELS.AllRequestModel) {
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
        this._store.dispatch(new ALL_REQUESTS_ACTIONS.ArchiveRequest({ requestId: record.id, choiceNote: res.choiceNote })).subscribe(() => this._snackbars.openSuccessSnackbar({
          message: SSAConfigInst.CRUD_CONFIG.successMessages.archived('Request-' + record.readableId),
        }))
      }
    })
  }

  public openRequestDetails(record: ALL_REQUESTS_MODELS.AllRequestModel) {
    this._router.navigate([{
      outlets: {
        'side-panel': ['request-details', record.id],
      }
    }], {
      queryParams: {
        type: record.workflowType,
      }
    })
  }

  public openSupportRequestDetails(record: ALL_REQUESTS_MODELS.AllRequestModel) {
    this._router.navigate([{
      outlets: {
        'side-panel': ['request-details','support', record.id],
      }
    }], {
      queryParams: {
        type: record.workflowType,
      }
    })
  }

}
