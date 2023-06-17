import { SharedModule } from '@shared/shared.module';
import { MyTeamsTasksState } from './state/my-teams-tasks.state';
import { NgxsModule } from '@ngxs/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamsTasksRoutingModule } from './my-teams-tasks-routing.module';
import { MyTeamsTasksComponent } from './pages/manage-my-teams-tasks/my-teams-tasks.component';
import { TableMyTeamsTasksComponent } from './components/table-my-teams-tasks/table-my-teams-tasks.component';
import { CardsMyTeamsTasksComponent } from './components/cards-my-teams-tasks/cards-my-teams-tasks.component';
import { CardWrapperMyTeamsTasksComponent } from './components/card-wrapper-my-teams-tasks/card-wrapper-my-teams-tasks.component';
import { ViewAssigneesComponent } from './components/view-assignees/view-assignees.component';


@NgModule({
  declarations: [
    MyTeamsTasksComponent,
    TableMyTeamsTasksComponent,
    CardsMyTeamsTasksComponent,
    CardWrapperMyTeamsTasksComponent,
    ViewAssigneesComponent
  ],
  imports: [
    CommonModule,
    MyTeamsTasksRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MyTeamsTasksState])
  ],
})
export class MyTeamsTasksModule { }
