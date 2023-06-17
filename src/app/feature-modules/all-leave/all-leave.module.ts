import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllLeaveRoutingModule } from './all-leave-routing.module';
import { AllLeaveComponent } from './pages/all-leave/all-leave.component';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { AllLeaveState } from './state/all-leave.state';
import { AllLeaveService } from './model/all-leave.service';
import { AllLeaveGuard } from './guards/all-leave.gaurd';
import { CardRequestsComponent } from './components/card-request/card-request.component';
import { CardsWrapperRequestsComponent } from './components/cards-wrapper-requests/cards-wrapper-requests.component';
import { TableRequestsComponent } from './components/table-requests/table-requests.component';


@NgModule({
  declarations: [AllLeaveComponent, CardRequestsComponent, CardsWrapperRequestsComponent, TableRequestsComponent],
  imports: [
    CommonModule,
    AllLeaveRoutingModule,
    SharedModule,
    SharedComponentsModule,
    NgxsModule.forFeature([AllLeaveState])
  ],
  providers: [AllLeaveService, AllLeaveGuard]
})
export class AllLeaveModule { }
