import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';

@Component({
  selector: 'ssa-on-boarding-documents',
  templateUrl: './on-boarding-documents.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      /* ul.dashed > li {
        text-indent: -5px;
      }
      ul.dashed > li:before {
        content: "- ";
        text-indent: -5px;
      } */
    `
  ]
})
export class OnBoardingDocumentsComponent implements OnInit {
  public documents: string[] = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: REQUEST_DETAILS_MODELS.onBoardingDetailsModel,
    private _dialogRef: MatDialogRef<OnBoardingDocumentsComponent>
  ) { }

  ngOnInit(): void {
    this.addDocumentsData();
  }

  public cancel() {
    this._dialogRef.close();
  }

  public addDocumentsData() {
    if (this.data.isOriginalAcademicDegreeDelivered) {
      this.documents.push('Original Academic Degree')
    }
    if (this.data.isCopyOfQualificationsCertificateDelivered) {
      this.documents.push('Copy of qualifications certificate')
    }
    if (this.data.isCopyOfExperienceCertificateDelivered) {
      this.documents.push('Copy of experience certificate')
    }
    if (this.data.isLaborOfficeCertificateDelivered) {
      this.documents.push('Labor office certificate')
    }
    if (this.data.isPoliceBlotterDelivered) {
      this.documents.push('Police Blotter (in the name of Flairstech)')
    }
    if (this.data.isOriginalCertificateOfMilitaryServiceDelivered) {
      this.documents.push('Original certificate of military service (for males only)')
    }
    if (this.data.isCopyOfInsuranceClearanceFormDelivered) {
      this.documents.push('Copy of insurance clearance form (form 6)')
    }
    if (this.data.isCopyOfIdDelivered) {
      this.documents.push('Copy of ID*2')
    }
    if(this.data.isPersonalPhotoDelivered){
      this.documents.push('Six personal photos')
    }
    if(this.data.isOriginalBirthCertificateDelivered){
      this.documents.push('Original birth certificate')
    }
    if(this.data.isInsurancePrintOutDelivered){
      this.documents.push('Insurance Print out')
    }
  }
}
