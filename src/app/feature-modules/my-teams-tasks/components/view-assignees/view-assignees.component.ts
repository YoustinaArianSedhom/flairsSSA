import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ssa-view-assignees',
  templateUrl: './view-assignees.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class ViewAssigneesComponent implements OnInit {

  public assignees$: Observable<MY_TEAMS_TASKS_MODEL.CurrentAssigneeModel[]>;
  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['name', 'email'],
    columns: [{
      key: 'name',
      head: 'Name',
      value: (record: MY_TEAMS_TASKS_MODEL.CurrentAssigneeModel) => record.fullName,
      view: {
        width: 30,
        headCell: {
          align: TableCellAligns.start,
        },
        bodyCell: {
          align: TableCellAligns.start,
        },
      }
    },
    {
      key: 'email',
      head: 'Email',
      value: (record: MY_TEAMS_TASKS_MODEL.CurrentAssigneeModel) => record.email,
      view: {
        width: 15,
        headCell: {
          align: TableCellAligns.start,
        },
        bodyCell: {
          align: TableCellAligns.start,
        },
      },
      type: TableCellTypes.email
    },
    ]
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) { }


  ngOnInit(): void {
    this.assignees$ = of(this.data?.currentAssignees)
  }

}
