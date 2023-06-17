import { SSAConfigInst } from 'src/app/config/app.config';
import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { HALF_DAY_LEAVE_TYPES } from '../../model/request-details.config';
import * as REQUEST_DETAILS_ACTIONS from '@modules/common/request-details/state/request-details.actions';

@Component({
  selector: 'ssa-leave-details',
  templateUrl: './leave-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class LeaveDetailsComponent {

  @Input() public leaveDetails: REQUEST_DETAILS_MODELS.LeaveDetailsModel;
  public REQUEST_TYPES = SSAConfigInst.REQUEST_TYPES_CONFIG
  public HALF_DAY_TYPE = HALF_DAY_LEAVE_TYPES
  constructor() { }
  @Dispatch() private _fireDownloadSickLeavePrescriptionFile(file: REQUEST_DETAILS_MODELS.DownloadLeaveFile) { return new REQUEST_DETAILS_ACTIONS.DownloadLeaveUploadedFile(file) }

  public downloadAllFiles() {
    let duration = 200;
    this.leaveDetails.uploadedFiles.map((file, i) => {
      duration = (i + 1) * 200;
      setTimeout(() => {
        const type = file.fullName.split('.')
        const fileBody: REQUEST_DETAILS_MODELS.DownloadLeaveFile = {
          requestId: this.leaveDetails.id,
          fileId: file.id,
          fileName: file.fullName,
        }
        this._fireDownloadSickLeavePrescriptionFile(fileBody);
      }, duration);
    })
  }



}
