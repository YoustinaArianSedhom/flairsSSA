import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';

@Component({
  selector: 'ssa-change-manager-request-details',
  templateUrl: './change-manager-request-details.component.html',
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
export class ChangeManagerRequestDetailsComponent {

  @Input() public changeManagerRequestDetails: REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel

  constructor() { }

}
