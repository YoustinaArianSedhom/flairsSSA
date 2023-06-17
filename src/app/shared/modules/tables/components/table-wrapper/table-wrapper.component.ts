import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { SSAConfigInst } from 'src/app/config/app.config';
import { Observable } from 'rxjs';
import { TableActionModel, TableColumnModel, TableConfigModel } from '../../model/tables.model';
import { TablesService } from '../../model/tables.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { auditTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _snackbar: SnackBarsService
  ) { }

  @Input() public classes: any;
  @Input() public records$: Observable<any>;
  @Input() public config: TableConfigModel;
  @Input() public showAndHideDrippledColumns: boolean = false
  @Input() public showAndHideShowDetails: boolean = false
  @Output() public actionTaken: EventEmitter<{
    action: TableActionModel,
    record: any
  }> = new EventEmitter();

  @Output() public sortChange: EventEmitter<{
    sortField: number;
    sortType: number;
  }> = new EventEmitter();

  @Output() public checkboxChange: EventEmitter<boolean> = new EventEmitter();
  @Input() public check:boolean = false
  @Output() public showDetailsChange: EventEmitter<boolean> = new EventEmitter();
  public dribbleColumns: TableConfigModel
  public currentIndex: number = null;
  public showDetails: boolean = false
  ngOnInit(): void {

    this._tablesService.tableActionsChange.subscribe((actions: TableActionModel[]) => {
      this.config = { ...this.config, actions }
    })
    if(this.showAndHideDrippledColumns){
      this._tablesService.tableColumnsChange.pipe(auditTime(1000), distinctUntilChanged()).subscribe((columns: string[])=>{
        this.dribbleColumns.columns = [];
        this.config.keys = [];
        this.config.columns.forEach(item=>{
          if(item.dribbleColumnDisplay){
            this.dribbleColumns.columns.push(item)
            if(!item.hidden){
              this.config.keys.push(item.key)
            }
          }

        })
        if(columns.includes('actions')){
          this.config.keys.push('actions')
        }

      })
    }else{

      this._tablesService.tableColumnsChange.subscribe((columns: string[]) => {
        this.config = { ...this.config, keys: columns }
      })
    }


    this._tablesService.tableActions.subscribe((action: { record: any; action: TableActionModel }) => {
      this.actionTaken.emit(action);
    })
    this.dribbleColumns = {...this.config}
    this.dribbleColumns.columns = this.config.columns.filter(element => element.dribbleColumnDisplay)
  }


  public getColumn(key: string) {
    return this.config.columns.find(column => column.key == key);
  }


  public get columnsWithoutActions() {
    return this.config.keys.filter(column => {
      return column != 'actions'
    })
  }





  public onSortChange($event: Sort) {
    const sortField = this.config.columns.find(column => column.key == $event.active).sort.sortField;
    this.sortChange.emit({
      sortField,
      sortType: SSAConfigInst.CRUD_CONFIG.sort[$event.direction]
    })
  }

  public onCheckboxChange(event) {
    this.checkboxChange.emit(event.checked)
  }

  public toggleShowAndHideColumn(key: string) {
    const columnConfig: TableColumnModel = this.getColumn(key);
    const keys = [...this.config.keys];
    if(this.config.keys.includes('actions'))      this.config.keys = this.config.keys.filter(item=> item !== 'actions')
    if(this.config.keys.length-1 < 1 && !columnConfig.hidden){
      this._snackbar.openWarningSnackbar({
        message: "One column must be shown at least"
      });
      return ;
    }
    columnConfig.hidden = !columnConfig.hidden

    this.config.keys = [...this.dribbleColumns.columns.filter(item => !item.hidden).map(col => col.key)]
    if(keys.includes("actions") ){
      this.config.keys.push('actions');
      this.dribbleColumns.keys = this.config.keys
    }
  }

  public drop(event: CdkDragDrop<TableColumnModel[]>) {
    if(!event.item.data.hidden) {
      this.currentIndex = event.currentIndex
      // moveItemInArray(this.config.keys, event.previousIndex, event.currentIndex);
      moveItemInArray(this.dribbleColumns.columns, event.previousIndex, event.currentIndex);
      this.config.keys = [...this.dribbleColumns.columns.filter(item => !item.hidden).map(col => col.key)]
      if(this.dribbleColumns?.keys.includes( "actions") ){
        this.config.keys.push('actions')
      }
    }
  }

  public onChangeShowDetails() {
    this.showDetails = !this.showDetails
    this.showDetailsChange.emit(this.showDetails)
  }

}
