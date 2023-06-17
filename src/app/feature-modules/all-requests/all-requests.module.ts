import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRequestsRoutingModule } from './all-requests-routing.module';
import { ManageAllRequestsComponent } from './pages/manage-all-requests/manage-all-requests.component';
import { SharedModule } from '@shared/shared.module';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { NgxsModule } from '@ngxs/store';
import { AllRequestsState } from './state/all-requests.state';
import { TableAllRequestsComponent } from './components/table-all-requests/table-all-requests.component';
import { AllRequestsCardsWrapperComponent } from './components/all-requests-cards-wrapper/all-requests-cards-wrapper.component';
import { AllRequestsCardRequestComponent } from './components/all-requests-card-request/all-requests-card-request.component';
import { AllRequestsService } from './models/all-requests.service';


@NgModule({
  declarations: [
    ManageAllRequestsComponent,
    TableAllRequestsComponent,
    AllRequestsCardsWrapperComponent,
    AllRequestsCardRequestComponent
  ],
  imports: [
    CommonModule,
    AllRequestsRoutingModule,
    SharedModule,
    SharedComponentsModule,
    NgxsModule.forFeature([AllRequestsState])
  ],
  providers:[AllRequestsService]
})
export class AllRequestsModule { }
