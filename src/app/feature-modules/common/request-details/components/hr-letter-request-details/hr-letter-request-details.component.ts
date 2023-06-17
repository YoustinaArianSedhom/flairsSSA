import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models'

@Component({
  selector: 'ssa-hr-letter-request-details',
  templateUrl: './hr-letter-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class HRLetterRequestDetailsComponent {

  @Input() public HRLetterRequestDetails: REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel

  constructor() { }

}
