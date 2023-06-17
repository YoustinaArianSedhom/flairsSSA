import { Component, Input, OnInit } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models'
import * as REQUEST_DETAILS_CONFIGS from '@modules/common/request-details/model/request-details.config'

@Component({
  selector: 'ssa-voucher-request-details',
  templateUrl: './voucher-request-details.component.html',
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
export class VoucherRequestDetailsComponent implements OnInit {

  @Input() public voucherRequestDetails: REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel
  voucherType = REQUEST_DETAILS_CONFIGS.VOUCHER_REQUEST_TYPES_CONFIG

  constructor() { }

  ngOnInit(): void {
  }

}
