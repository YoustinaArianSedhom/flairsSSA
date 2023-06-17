import { MyTeamsTasksComponent } from './pages/manage-my-teams-tasks/my-teams-tasks.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTeamsTasksGuard } from './guards/my-teams-tasks.guard';

const routes: Routes = [
  {path: '', component: MyTeamsTasksComponent, canActivate: [MyTeamsTasksGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamsTasksRoutingModule { }
