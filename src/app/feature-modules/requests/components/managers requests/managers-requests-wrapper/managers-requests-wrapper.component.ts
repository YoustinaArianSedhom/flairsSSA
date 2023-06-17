import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ChangeManagerRequestFormComponent } from '../change-manager-request-form/change-manager-request-form.component';
import { GounaVoucherRequestFormComponent } from '../gouna-voucher-request-form/gouna-voucher-request-form.component';
import { PromotionRequestFormComponent } from '../promotion-request-form/promotion-request-form.component';
import { RaiseRequestFormComponent } from '../raise-request-form/raise-request-form.component';
import { VoucherRequestFormComponent } from '../voucher-request-form/voucher-request-form.component';
import { CreateRecruitmentFormComponent } from '../create-recruitment-form/create-recruitment-form.component';
import { Router } from '@angular/router';
import { ExpenseRepaymentComponent } from '../expense-repayment/expense-repayment.component';
import { CreatePipFormComponent } from '../create-pip-form/create-pip-form.component';

@Component({
  selector: 'ssa-managers-requests-wrapper',
  templateUrl: './managers-requests-wrapper.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ManagersRequestsWrapperComponent {

  constructor(
    private _matDialog: MatDialog,
    private _snackbars: SnackBarsService,
    private _router: Router,
    private _http: HttpService,
  ) { }


  public openChangeManagerRequestForm() {
    this._matDialog.open(ChangeManagerRequestFormComponent, {
      panelClass: ['form-dialog--small']
    })
  }

  public openPromotionForm() {
    this._http.fetch("Request/IsManager").subscribe(({ result: isPayrollManager }: ApiResponse<boolean>) => {
      if (isPayrollManager) this._matDialog.open(PromotionRequestFormComponent, {
        panelClass: ['form-dialog--small']
      });

      else this._snackbars.openWarningSnackbar({
        message: 'You have to be a Manager to be able to create Promotion request',
        duration: 7
      })
    })
  }

  public openRaiseForm() {
    this._http.fetch("Request/IsManager").subscribe(({ result: isPayrollManager }: ApiResponse<boolean>) => {
      if (isPayrollManager) this._matDialog.open(RaiseRequestFormComponent, {
        panelClass: ['form-dialog--small']
      });

      else this._snackbars.openWarningSnackbar({
        message: 'You have to be a Manager to be able to create Raise request',
        duration: 7
      })
    })

  }

  public openVoucherRequestForm() {
    this._matDialog.open(VoucherRequestFormComponent, {
      panelClass: ['form-dialog--small']
    });

  }




  public openGounaVoucherRequestForm() {
    this._http.fetch("Request/IsManager").subscribe(({ result: isPayrollManager }: ApiResponse<boolean>) => {
      if (isPayrollManager) this._matDialog.open(GounaVoucherRequestFormComponent, {
        panelClass: ['form-dialog--small']
      });

      else this._snackbars.openWarningSnackbar({
        message: 'You have to be a Manager to be able to create Gouna Voucher request',
        duration: 7
      })
    })
  }

  public openRecruitmentRequestForm() {
    this._router.navigateByUrl('/my-requests/create-recruitment')
  }

  public openExpenseRepaymentRequestForm() {
    this._matDialog.open(ExpenseRepaymentComponent, {
      panelClass: ['form-dialog--small']
    })
  }

  public openStartPIPRequestForm() {
    this._matDialog.open(CreatePipFormComponent,{
      panelClass: ['form-dialog--medium']
    })
  }

}
