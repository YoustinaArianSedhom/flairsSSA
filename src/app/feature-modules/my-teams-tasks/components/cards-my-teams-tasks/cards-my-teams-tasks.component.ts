import { Component, OnInit, Input } from '@angular/core';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_CONFIG from '@modules/my-teams-tasks/models/my-teams-tasks.config'
import { Router } from '@angular/router';

@Component({
  selector: 'ssa-cards-my-teams-tasks',
  templateUrl: './cards-my-teams-tasks.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class CardsMyTeamsTasksComponent implements OnInit {

  @Input() public record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel;
  public requestType = MY_TEAMS_TASKS_CONFIG.REQUEST_TYPES_CONFIG

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  public viewDetails(record: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel) {
    this._router.navigate([{
      outlets: { 'side-panel': ['request-details', record.id] }
    }], { queryParams: { type: record.workflowType } })
  }

}
