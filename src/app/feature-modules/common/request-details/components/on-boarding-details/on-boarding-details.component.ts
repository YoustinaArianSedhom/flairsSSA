import { Component, Input, OnInit } from '@angular/core';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import * as REQUEST_DETAILS_CONFIG from '@modules/common/request-details/model/request-details.config'
import { MatDialog } from '@angular/material/dialog';
import { OnBoardingDocumentsComponent } from './on-boarding-documents/on-boarding-documents.component';

@Component({
  selector: 'ssa-on-boarding-details',
  templateUrl: './on-boarding-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      :host ::ng-deep ul,ol{
          list-style: initial;
          margin:initial;
          padding: revert;
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
      
    `
  ]
})
export class OnBoardingDetailsComponent implements OnInit {

  @Input() public onBoardingDetails: REQUEST_DETAILS_MODELS.onBoardingDetailsModel;
  public contractType = REQUEST_DETAILS_CONFIG.CONTRACT_TYPE;
  public step = 0;  //this for make the general info always opened
  public receivedDocuments: boolean = false;

  constructor(private _matDialog: MatDialog) { }
  ngOnInit(): void {
    this.checkDocuments();
  }

  public openReceivedDocuments() {
    this._matDialog.open(
      OnBoardingDocumentsComponent, {
      data: this.onBoardingDetails,
      panelClass: ['form-dialog--small']
    }
    )
  }

  public checkDocuments() {
    if (
      this.onBoardingDetails.isOriginalAcademicDegreeDelivered !== null ||
      this.onBoardingDetails.isCopyOfQualificationsCertificateDelivered !== null ||
      this.onBoardingDetails.isCopyOfExperienceCertificateDelivered !== null ||
      this.onBoardingDetails.isLaborOfficeCertificateDelivered !== null ||
      this.onBoardingDetails.isPoliceBlotterDelivered !== null ||
      this.onBoardingDetails.isOriginalCertificateOfMilitaryServiceDelivered !== null ||
      this.onBoardingDetails.isCopyOfInsuranceClearanceFormDelivered !== null ||
      this.onBoardingDetails.isCopyOfIdDelivered !== null ||
      this.onBoardingDetails.isPersonalPhotoDelivered !== null ||
      this.onBoardingDetails.isOriginalBirthCertificateDelivered !== null ||
      this.onBoardingDetails.isInsurancePrintOutDelivered !== null
    ) {
      this.receivedDocuments = true
    }

  }
}
