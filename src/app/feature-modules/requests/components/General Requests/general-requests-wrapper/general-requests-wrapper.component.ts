import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HRRequestFormComponent } from '../hr-request-form/hr-request-form.component';
import { PeerToPeerRequestFormComponent } from '../peer-to-peer-request-form/peer-to-peer-request-form.component';
import { TrainingRequestFormComponent } from '../training-request-form/training-request-form.component';
import { BalanceManagementFormComponent } from '../balance-management-form/balance-management-form.component';
import { CreateAllocationRequestFormComponent } from '../create-allocation-request-form/create-allocation-request-form.component';
import { ResignationRequestFormComponent } from '../resignation-request-form/resignation-request-form.component';
import { TerminationRequestFormComponent } from '../termination-request-form/termination-request-form.component';

@Component({
  selector: 'ssa-general-requests-wrapper',
  templateUrl: './general-requests-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class GeneralRequestsWrapperComponent {
 
  constructor(
    private _matDialog: MatDialog,
  ) {   }
 

  public openHRRequestForm() {
    this._matDialog.open(HRRequestFormComponent, {
      panelClass: ["form-dialog--small"]
    })
  }
  public openTrainingRequestForm() {
    this._matDialog.open(TrainingRequestFormComponent, {
      panelClass: ["form-dialog--small"]
    })
  }

  public openPeerToPeerRequestForm() {
    this._matDialog.open(PeerToPeerRequestFormComponent, {
      panelClass: ["form-dialog--small"]
    })
  }

 
  public openBalanceManagementForm() {
    this._matDialog.open(BalanceManagementFormComponent, {
      panelClass: ['form-dialog'],
    })
  }

  public openCreateAllocationForm() {
    this._matDialog.open(CreateAllocationRequestFormComponent, {
      panelClass: ['form-dialog'],
    })
  }


  public openResignationForm() {
    this._matDialog.open(ResignationRequestFormComponent, {
      panelClass: ['form-dialog'],
    })
  }

  public openTerminationForm(){
    this._matDialog.open(TerminationRequestFormComponent, {
      panelClass: ['form-dialog'],
    })
  }

}
