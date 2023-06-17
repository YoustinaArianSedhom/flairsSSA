import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMyTeamRequestsComponent } from './pages/manage-my-team-requests/manage-my-team-requests.component';
import { MyTeamRequestsGuard } from './guards/my-team-requests.guard';

const routes: Routes = [
    {
      canActivate:[MyTeamRequestsGuard],
      path:'',
      component:ManageMyTeamRequestsComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamRequestsRoutingModule { }
