import { Component, Input} from '@angular/core';
import { NoShowDetailsModel } from '../../model/request-details.models';

@Component({
  selector: 'ssa-no-show-details',
  templateUrl: './no-show-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class NoShowDetailsComponent {
  @Input() noShowDetails: NoShowDetailsModel
  constructor() { }


}
