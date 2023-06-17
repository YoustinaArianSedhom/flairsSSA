import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as MY_REQUESTS_MODELS from '@modules/requests/model/requests.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';



type cardType = 'my';
@Component({
  selector: 'ssa-cards-wrapper-requests',
  templateUrl: './cards-wrapper-requests.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardsWrapperRequestsComponent {

  @Input() public records$: Observable<MY_REQUESTS_MODELS.MyRequestModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  // @Input() public cardType: cardType;
  
  constructor(
  ) { }
  
  @Dispatch() public firePaginateRequestsAction(pagination: PaginationConfigModel) {
    return new this.actions.paginate(pagination)
  }


}
