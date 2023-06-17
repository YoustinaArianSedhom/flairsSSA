import { Component, Input } from '@angular/core';
import * as MY_REQUESTS_CONFIG from '@modules/requests/model/requests.config';
import { BalanceManagementModel } from '../../model/request-details.models';

@Component({
  selector: 'ssa-balanace-management',
  templateUrl: './balanace-management.component.html',
  styles: []
})
export class BalanaceManagementComponent  {

  @Input() itemDetail :BalanceManagementModel;

  public requestTypes = MY_REQUESTS_CONFIG.BalanceRequestTypes;
  public leaveTypes = MY_REQUESTS_CONFIG.BalanceLeaveTypes;



  constructor() {
   
   }



 
}
