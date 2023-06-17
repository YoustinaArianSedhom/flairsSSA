import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';


@Component({
  selector: 'ssa-peer-to-peer-request-details',
  templateUrl: './peer-to-peer-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class PeerToPeerRequestDetailsComponent {


  @Input() public peerToPeerRequestDetails: REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel
  constructor() { }

}
