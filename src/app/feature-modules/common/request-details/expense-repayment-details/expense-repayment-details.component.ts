import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import { BeneficiariesComponent } from './beneficiaries/beneficiaries.component';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as REQUEST_DETAILS_ACTIONS from '@modules/common/request-details/state/request-details.actions';
import { of } from 'rxjs';

@Component({
  selector: 'ssa-expense-repayment-details',
  templateUrl: './expense-repayment-details.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ExpenseRepaymentDetailsComponent {
  @Input() public expenseRepaymentDetails: REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel;
  constructor(private _matDialog: MatDialog) { }

  @Dispatch() private _fireDownloadExpenseReceiptFile(item: REQUEST_DETAILS_MODELS.DownloadExpenseReceipt) { return new REQUEST_DETAILS_ACTIONS.DownloadExpenseReceiptFile(item) }

  public downloadFile(item: REQUEST_DETAILS_MODELS.DownloadExpenseReceipt) {
    const fileBody: REQUEST_DETAILS_MODELS.DownloadExpenseReceipt = {
      requestId: this.expenseRepaymentDetails.id,
      file: item.file,
      fileName: item.fileName,
    }
    this._fireDownloadExpenseReceiptFile(fileBody);
  }

  public openBeneficiariesComponent() {
    this._matDialog.open(BeneficiariesComponent, {
      data: of(this.expenseRepaymentDetails.beneficiaries),
      panelClass: ['form-dialog--medium']
    })
  }

}
