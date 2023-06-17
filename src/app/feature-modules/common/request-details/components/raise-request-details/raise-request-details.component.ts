import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';


@Component({
  selector: 'ssa-raise-request-details',
  templateUrl: './raise-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
      }
    `
  ]
})
export class RaiseRequestDetailsComponent {

  @Input() public raiseRequestDetails: REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel

  constructor() { }

}
