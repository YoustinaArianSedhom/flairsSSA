import { SSAConfigInst } from 'src/app/config/app.config';
import { Component, Input, OnInit } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as REQUESTS_STATUSES_BG_COLOR from '@modules/common/model/status.model'
@Component({
  selector: 'ssa-request-details-header',
  templateUrl: './request-details-header.component.html'
})
export class RequestDetailsHeaderComponent{


  @Input() public requestSummary: REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel | REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel | REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel

  public requestType = SSAConfigInst.REQUEST_TYPES_CONFIG

  public REQUESTS_STATUSES_BG_COLOR = REQUESTS_STATUSES_BG_COLOR.REQUESTS_STATUSES_BG_COLOR;

  constructor(private _router: Router, private _location: Location) { }

  public closeDialog(): void {
    this._router.navigate([{
      outlets: { 'side-panel': null }
    }])
  }
}
