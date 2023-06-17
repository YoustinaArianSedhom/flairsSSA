import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Component({
  selector: 'ssa-my-team-requests-cards-wrapper',
  templateUrl: './my-team-requests-cards-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class MyTeamRequestsCardsWrapperComponent {
  @Input() public records$: Observable<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  constructor() { }

  @Dispatch() public firePaginate(pagination: PaginationConfigModel) { return new this.actions.paginate(pagination) }

}
