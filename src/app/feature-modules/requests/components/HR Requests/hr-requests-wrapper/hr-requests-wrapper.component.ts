import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ReferralRequestFormComponent } from '../referral-request-form/referral-request-form.component';

@Component({
  selector: 'ssa-hr-requests-wrapper',
  templateUrl: './hr-requests-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class HRRequestsWrapperComponent {

  constructor(
    private _matDialog: MatDialog,
    private _snackbars: SnackBarsService,
    private _http: HttpService,
  ) {

  }

  public openReferralRequestForm() {
    this._http.fetch("Request/IsHRManagerOrBusinessPartner").subscribe(({ result: isPayrollManager }: ApiResponse<boolean>) => {
      if (isPayrollManager) this._matDialog.open(ReferralRequestFormComponent, {
        panelClass: ['form-dialog--small']
      });

      else this._snackbars.openWarningSnackbar({
        message: 'You have to be a HR or HR Manager to be able to create Referral request',
        duration: 7
      })
    })
  }
}
