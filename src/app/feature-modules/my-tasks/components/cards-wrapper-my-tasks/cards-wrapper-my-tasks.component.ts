import { Component, OnInit } from '@angular/core';
import * as MY_TASKS_MODELS from '../../models/my-tasks.model';
import * as MY_TASKS_ACTIONS from '../../state/my-tasks.actions'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { MyTasksState } from '@modules/my-tasks/state/my-tasks.state';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';



@Component({
  selector: 'ssa-cards-wrapper-my-tasks',
  templateUrl: './cards-wrapper-my-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardsWrapperMyTasksComponent implements OnInit {
  
  @Select(MyTasksState.myTasks) public myTasks$: Observable<MY_TASKS_MODELS.MyTasksModel[]>
  
  @ViewSelectSnapshot(MyTasksState.paginationConfig) public pagination: PaginationConfigModel
  
  constructor(){ }
  
  /*_________________________________________ACTIONS TRIGGERS_______________________________________*/
  @Dispatch() public firePaginateMyTasks(pagination: PaginationConfigModel) { return new MY_TASKS_ACTIONS.PaginateMyTasks(pagination) }
  @Dispatch() private _fireMyTasksTable() { return new MY_TASKS_ACTIONS.GetMyTasks() }
  
  ngOnInit(): void {
    this._fireMyTasksTable();
  }



}
