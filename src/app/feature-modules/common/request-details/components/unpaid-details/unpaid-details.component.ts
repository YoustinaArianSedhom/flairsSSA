import { Component, Input } from '@angular/core';
import { UnpaidModel } from '../../model/request-details.models';

@Component({
  selector: 'ssa-unpaid-details',
  templateUrl: './unpaid-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class UnpaidDetailsComponent  {

  @Input() unpaidDetails: UnpaidModel;
  constructor() { }

 

}
