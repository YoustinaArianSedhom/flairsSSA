import { Component, Input, OnInit } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';

@Component({
  selector: 'ssa-pip-details',
  templateUrl: './pip-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class PipDetailsComponent implements OnInit {

  @Input() pipDetails: REQUEST_DETAILS_MODELS.PIPDetailsModel;
  constructor() { }

  ngOnInit(): void {
  }

}
