import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTeamLeavesRoutingModule } from './my-team-leaves-routing.module';
import { ManageMyTeamLeavesComponent } from './pages/manage-my-team-leaves/manage-my-team-leaves.component';
import { SharedModule } from '@shared/shared.module';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { NgxsModule } from '@ngxs/store';
import { MyTeamLeaveState } from './state/my-team-leave.state';
import { TableMyTeamsLeaveRequestsComponent } from './components/table-my-teams-leave-requests/table-my-teams-leave-requests.component';
import { CardsWrapperMyTeamLeaveRequestsComponent } from './components/cards-wrapper-my-team-leave-requests/cards-wrapper-my-team-leave-requests.component';
import { MyTeamLeaveCardRequestComponent } from './components/my-team-leave-card-request/my-team-leave-card-request.component';


@NgModule({
  declarations: [
    ManageMyTeamLeavesComponent,
    TableMyTeamsLeaveRequestsComponent,
    CardsWrapperMyTeamLeaveRequestsComponent,
    MyTeamLeaveCardRequestComponent
  ],
  imports: [
    CommonModule,
    MyTeamLeavesRoutingModule,
    SharedModule,
    SharedComponentsModule,
    NgxsModule.forFeature([MyTeamLeaveState])

  ]
})
export class MyTeamLeavesModule { }
