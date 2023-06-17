/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnModel } from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';

@Component({
  selector: 'app-table-body-cell',
  templateUrl: './table-body-cell.component.html',
  styleUrls: ['./table-body-cell.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableBodyCellComponent implements OnInit {


  constructor(
    private _matDialog: MatDialog,
    private _tables: TablesService
  ) { }

  @Input() record: any;
  @Input() column: TableColumnModel;
  @Input() index: number;
  ngOnInit(): void { }


  public setCellClasses(classes, record?: any) {
    if (typeof classes == 'function') return classes(record);
    else if (typeof classes == 'string') return classes;
    else return '';


  }

  public onCheckboxChange(ev, record) {
    this._tables.tableActions.next({ record, action: { key: 'checkbox', label: ev.checked }})
  }

  public setExtraInfoClasses(classes, record?: any) {
    if (typeof classes == 'function') return classes(record);
    else if (typeof classes == 'string') return classes;
    else return '';

  }


  public onAdditionDeductionClick(record) {
    this._tables.tableActions.next({ record, action: record.action })
  }

  public emitEvent(record, { key, label }: { key: string, label: string }) {
    this._tables.tableActions.next({ record, action: { key, label } })
  }



}
