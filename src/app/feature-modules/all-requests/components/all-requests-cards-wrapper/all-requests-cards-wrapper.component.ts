import { Component, Input } from '@angular/core';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

@Component({
  selector: 'ssa-all-requests-cards-wrapper',
  templateUrl: './all-requests-cards-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AllRequestsCardsWrapperComponent{
  @Input() public records$: Observable<ALL_REQUESTS_MODELS.AllRequestModel[]>;
  @Input() public pagination: PaginationConfigModel;
  @Input() public actions: { [key: string]: any } = {};
  constructor() { }

  @Dispatch() public firePaginate(pagination: PaginationConfigModel) { return new this.actions.paginate(pagination) }

}
