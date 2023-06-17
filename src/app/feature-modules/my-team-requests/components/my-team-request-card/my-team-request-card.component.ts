import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';
import { Router } from '@angular/router';
import * as MY_TEAM_REQUESTS_CONFIG from '@modules/my-team-requests/models/my-team-requests.config';

@Component({
  selector: 'ssa-my-team-request-card',
  templateUrl: './my-team-request-card.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MyTeamRequestCardComponent {
  @Input() public record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel;
  @Input() public pagination: PaginationConfigModel;
  public requestStatusesEnum: typeof MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM = MY_TEAM_REQUESTS_CONFIG.REQUEST_STATUES_ENUM
  public requestType:typeof MY_TEAM_REQUESTS_CONFIG.REQUEST_TYPES_CONFIG = MY_TEAM_REQUESTS_CONFIG.REQUEST_TYPES_CONFIG
  
  constructor(
    private _router: Router
  ) { }

  openRequestDetails(record: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel) {
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
