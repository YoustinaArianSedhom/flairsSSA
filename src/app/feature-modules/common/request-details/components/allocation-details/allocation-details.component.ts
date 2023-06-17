import { Component, Input, OnInit } from '@angular/core';
import { AllocationModel } from '../../model/request-details.models';

@Component({
  selector: 'ssa-allocation-details',
  templateUrl: './allocation-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AllocationDetailsComponent{

  @Input() allocationDetail :AllocationModel;

  empolyeNames: string[];
  // public leaveTypes = MY_REQUESTS_CONFIG.BalanceLeaveTypes;


  constructor() { }


}
