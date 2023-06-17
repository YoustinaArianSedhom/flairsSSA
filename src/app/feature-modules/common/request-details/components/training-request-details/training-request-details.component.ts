import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';


@Component({
  selector: 'ssa-training-request-details',
  templateUrl: './training-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class TrainingRequestDetailsComponent {

  @Input() public trainingRequestDetails:REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel
  constructor() { }

}
