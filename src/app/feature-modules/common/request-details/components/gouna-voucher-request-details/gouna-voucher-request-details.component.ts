import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import * as REQUEST_DETAILS_ACTIONS from '@modules/common/request-details/state/request-details.actions';
import * as REQUEST_DETAILS_CONFIGS from '@modules/common/request-details/model/request-details.config';

@Component({
  selector: 'ssa-gouna-voucher-request-details',
  templateUrl: './gouna-voucher-request-details.component.html',
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
export class GounaVoucherRequestDetailsComponent {


  @Input() public gounaVoucherRequestDetails: REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails
  constructor() { }

}
