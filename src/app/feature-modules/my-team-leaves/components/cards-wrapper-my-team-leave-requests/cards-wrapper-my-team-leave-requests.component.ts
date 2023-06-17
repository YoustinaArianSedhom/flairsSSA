import { Component, Input } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as MY_TEAM_LEAVE_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';

@Component({
  selector: 'ssa-cards-wrapper-my-team-leave-requests',
  templateUrl: './cards-wrapper-my-team-leave-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardsWrapperMyTeamLeaveRequestsComponent {
  @Input() public records$: Observable<MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  constructor() { }

  @Dispatch() public firePaginate(pagination: PaginationConfigModel) { return new this.actions.paginate(pagination) }


}
