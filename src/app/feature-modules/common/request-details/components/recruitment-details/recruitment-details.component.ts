import { Component, Input } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import * as REQUEST_DETAILS_CONFIG from '@modules/common/request-details/model/request-details.config'
import * as REQUESTS_CONFIG from '@modules/requests/model/requests.config'

@Component({
  selector: 'ssa-recruitment-details',
  templateUrl: './recruitment-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      :host ::ng-deep ul {
        list-style: initial;
        margin:initial;
        padding: revert;
      }
      :host ::ng-deep ol {
        list-style: auto;
        margin: auto;
        padding: auto;
      }
      
      :host ::ng-deep ::after{
        border-color: black;
      }

      
      :host ::ng-deep .mat-expansion-panel{ 
        box-shadow: initial;
      }

      :host ::ng-deep .mat-expansion-panel-header,.mat-expansion-panel-body{ 
        padding: 0px 0.5rem;
      }

      :host ::ng-deep .mat-expansion-panel-body{ 
        font-family:"Noto Sans JP", sans-serif;
      }

      .onBoarding {
        background: #B5E9BE;
      }

      .complete {
        background: #08B524;
        border-radius: 4px 0px 0px 0px;
        color: #FFFFFF;
      }
      .InProgress {
        background: #F6B60D;
        border-radius: 4px 0px 0px 4px;
        color: #FFFFFF;
      }

      .cancelled {
        background: #D03827;
        border-radius: 4px 0px 0px 4px;
        color: #FFFFFF;
      }
      .onBoarding-label-color {
        background-color: #E5F7E8;
      }

      
      .offers {
        background: #C4E3E7;
      }

      .offers-label-color {
        background-color: #EAF5F7;
      }

      :host ::ng-deep .comments ul{
        list-style: none;
        padding: 0px;
      }

      .base-height {
        height: 2.2rem;
      }
      .show-all {
        height: auto;
      }
    `,
  ],
})
export class RecruitmentDetailsComponent {
  @Input() public recruitmentDetails: REQUEST_DETAILS_MODELS.RecruitmentDetailsModel;
  public step = 0; //this is for make general info always open
  public employmentType = REQUEST_DETAILS_CONFIG.EMPLOYMENT_TYPES;
  public priority = REQUESTS_CONFIG.PRIORITIES_ENUM;
  public daysOFWeeks = REQUESTS_CONFIG.DAYS_OF_WEEK;
  public showAndHideArrow = {
    onBoardingCompleteArrow: false,
    onBoardingInProgressArrow: false,
    onBoardingCancelArrow: false,
    offersCompleteArrow: false,
    offersInProgressArrow: false,
    offersRejectedArrow: false
  }
  constructor() { }

}
