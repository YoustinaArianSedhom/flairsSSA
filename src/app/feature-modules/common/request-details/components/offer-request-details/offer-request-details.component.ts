import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import {EMPLOYMENT_TYPES} from '@modules/common/request-details/model/request-details.config'

@Component({
  selector: 'ssa-offer-request-details',
  templateUrl: './offer-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class OfferRequestDetailsComponent  {

  @Input() public offerRequestDetails:REQUEST_DETAILS_MODELS.OfferDetailsModel
  public employmentTypes = EMPLOYMENT_TYPES;

  constructor() { }

}
