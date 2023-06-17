import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMyTeamLeavesComponent } from './pages/manage-my-team-leaves/manage-my-team-leaves.component';
import { MyTeamLeaveGuard } from './gaurds/my-team-leave.guard';

const routes: Routes = [
  {
    canActivate:[MyTeamLeaveGuard],
    path:'',
    component:ManageMyTeamLeavesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamLeavesRoutingModule { }
