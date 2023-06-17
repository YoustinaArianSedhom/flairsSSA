import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamRequestsRoutingModule } from './my-team-requests-routing.module';
import { ManageMyTeamRequestsComponent } from './pages/manage-my-team-requests/manage-my-team-requests.component';
import { TableMyTeamRequestsComponent } from './components/table-my-team-requests/table-my-team-requests.component';
import { MyTeamRequestCardComponent } from './components/my-team-request-card/my-team-request-card.component';
import { MyTeamRequestsCardsWrapperComponent } from './components/my-team-requests-cards-wrapper/my-team-requests-cards-wrapper.component';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MyTeamRequestsState } from './state/my-team-requests.state';


@NgModule({
  declarations: [
    ManageMyTeamRequestsComponent,
    TableMyTeamRequestsComponent,
    MyTeamRequestCardComponent,
    MyTeamRequestsCardsWrapperComponent
  ],
  imports: [
    CommonModule,
    MyTeamRequestsRoutingModule,
    SharedComponentsModule,
    SharedModule,
    NgxsModule.forFeature([MyTeamRequestsState])

  ]
})
export class MyTeamRequestsModule { }
