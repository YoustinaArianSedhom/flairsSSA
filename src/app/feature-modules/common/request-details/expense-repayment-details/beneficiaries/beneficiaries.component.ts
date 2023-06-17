import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import * as REQUESTS_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models'
import { Observable } from 'rxjs';
@Component({
  selector: 'ssa-beneficiaries',
  templateUrl: './beneficiaries.component.html',
  styles: [
    `
      :host {
        display: block;
        
      }
      table {
  width: 100%;
      } 
tr {
  display: table-row;
}

    `
  ]
})
export class BeneficiariesComponent {

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['index','fullName', 'organizationEmail'],
    columns: [
      {
        key: 'index',
        head: '#',
        hidden: false,
        value: () => { return 1 },
        view: {
          width: 7,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.index
      },
      {
        key: 'fullName',
        head: 'Full Name',
        hidden: false,
        value: (record: REQUESTS_DETAILS_MODELS.Beneficiaries) => { return record.fullName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'organizationEmail',
        head: 'Email',
        hidden: false,
        value: (record: REQUESTS_DETAILS_MODELS.Beneficiaries) => { return record.organizationEmail },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.email
      }
    ]
  }


  constructor(@Inject(MAT_DIALOG_DATA) public beneficiaries$: Observable<REQUESTS_DETAILS_MODELS.Beneficiaries[]>,
    private _dialogRef: MatDialogRef<BeneficiariesComponent>) { }



  public cancel() {
    this._dialogRef.close();
  }

}
