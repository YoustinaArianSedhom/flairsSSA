import { Component, OnInit } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { MyTeamsTasksState } from '@modules/my-teams-tasks/state/my-teams-tasks.state';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_ACTIONS from '@modules/my-teams-tasks/state/my-teams-tasks.action' 
@Component({
  selector: 'ssa-card-wrapper-my-teams-tasks',
  templateUrl: './card-wrapper-my-teams-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardWrapperMyTeamsTasksComponent implements OnInit {

  @Select(MyTeamsTasksState.myTeamsTasks) public myTeamsTasks$: Observable<MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel[]>
  @ViewSelectSnapshot(MyTeamsTasksState.PaginateMyTeamsTasks) public pagination: PaginationConfigModel
  
  constructor(){ }
  
  @Dispatch() public firePaginateMyTasks(pagination: PaginationConfigModel) { return new MY_TEAMS_TASKS_ACTIONS.PaginateMyTeamsTasks(pagination) }
  
  ngOnInit(): void {
    this._fireMyTasksTable();
  }

  @Dispatch() private _fireMyTasksTable() { return new MY_TEAMS_TASKS_ACTIONS.GetMyTeamsTasks() }
}
