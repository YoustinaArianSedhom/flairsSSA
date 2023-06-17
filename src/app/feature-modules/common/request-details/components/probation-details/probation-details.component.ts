import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';

@Component({
  selector: 'ssa-probation-details',
  templateUrl: './probation-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ProbationDetailsComponent {
  
  @Input() public probationDetails: REQUEST_DETAILS_MODELS.ProbationDetailsModel
  
  constructor() { }


}
