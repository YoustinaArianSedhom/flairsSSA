import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Router } from '@angular/router';
import * as MY_TEAM_LEAVE_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';
import * as MY_TEAM_LEAVE_CONFIGS from '@modules/my-team-leaves/models/my-team-leave.config';
@Component({
  selector: 'ssa-my-team-leave-card-request',
  templateUrl: './my-team-leave-card-request.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MyTeamLeaveCardRequestComponent  {
  @Input() public record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel;
  @Input() public pagination: PaginationConfigModel;
  public requestStatusesEnum: typeof MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM = MY_TEAM_LEAVE_CONFIGS.REQUEST_STATUES_ENUM
  public requestType = MY_TEAM_LEAVE_CONFIGS.REQUEST_TYPES_CONFIG
  constructor(
    private _router: Router
  ) {
   }

  openRequestDetails(record: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel) {
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
