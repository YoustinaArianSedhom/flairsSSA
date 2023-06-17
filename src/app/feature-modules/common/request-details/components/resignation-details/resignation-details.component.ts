import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';

@Component({
  selector: 'ssa-resignation-details',
  templateUrl: './resignation-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ResignationDetailsComponent {

  @Input() public resignationDetails: REQUEST_DETAILS_MODELS.ResignationDetailsModel;

  constructor() { }



}
