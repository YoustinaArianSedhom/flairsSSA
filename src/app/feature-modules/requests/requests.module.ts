import { NgModule } from '@angular/core';

import { MyRequestsRoutingModule } from './requests-routing.module';
import { ManageMyRequestsComponent } from './pages/manage-my-requests/manage-my-requests.component';
import { PromotionRequestFormComponent } from './components/managers requests/promotion-request-form/promotion-request-form.component';
import { RaiseRequestFormComponent } from './components/managers requests/raise-request-form/raise-request-form.component';
import { SharedModule } from '@shared/shared.module';
import { MyRequestsService } from './model/requests.service';
import { NgxsModule } from '@ngxs/store';
import { RequestsState } from './state/requests.state';
import { TableRequestsComponent } from './components/table-requests/table-requests.component';
import { CardRequestsComponent } from './components/card-request/card-request.component';
import { CardsWrapperRequestsComponent } from './components/cards-wrapper-requests/cards-wrapper-requests.component';
import { HRRequestFormComponent } from './components/General Requests/hr-request-form/hr-request-form.component';
import { ChangeManagerRequestFormComponent } from './components/managers requests/change-manager-request-form/change-manager-request-form.component';
import { VoucherRequestFormComponent } from './components/managers requests/voucher-request-form/voucher-request-form.component';
import { ReferralRequestFormComponent } from './components/HR Requests/referral-request-form/referral-request-form.component';
import { ManageCreateRequestsComponent } from './pages/manage-create-requests/manage-create-requests.component';
import { HRRequestsWrapperComponent } from './components/HR Requests/hr-requests-wrapper/hr-requests-wrapper.component';
import { GeneralRequestsWrapperComponent } from './components/General Requests/general-requests-wrapper/general-requests-wrapper.component';
import { ManagersRequestsWrapperComponent } from './components/managers requests/managers-requests-wrapper/managers-requests-wrapper.component';
import { GounaVoucherRequestFormComponent } from './components/managers requests/gouna-voucher-request-form/gouna-voucher-request-form.component';
import { TrainingRequestFormComponent } from './components/General Requests/training-request-form/training-request-form.component';
import { PeerToPeerRequestFormComponent } from './components/General Requests/peer-to-peer-request-form/peer-to-peer-request-form.component';
import { LeaveRequestFormComponent } from './components/Leave Requests/leave-request-form/leave-request-form.component';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { BalanceManagementFormComponent } from './components/General Requests/balance-management-form/balance-management-form.component';
import { CreateAllocationRequestFormComponent } from './components/General Requests/create-allocation-request-form/create-allocation-request-form.component';
import { LeaveRequestModule } from '@flairstechproductunit/flairstech-libs';
import { ResignationRequestFormComponent } from './components/General Requests/resignation-request-form/resignation-request-form.component';
import { TerminationRequestFormComponent } from './components/General Requests/termination-request-form/termination-request-form.component';
import { CreateRecruitmentFormComponent } from './components/managers requests/create-recruitment-form/create-recruitment-form.component';
import { ExpenseRepaymentComponent } from './components/managers requests/expense-repayment/expense-repayment.component';
import { CreatePipFormComponent } from './components/managers requests/create-pip-form/create-pip-form.component';


@NgModule({
  declarations: [ManageMyRequestsComponent, TableRequestsComponent, PromotionRequestFormComponent, RaiseRequestFormComponent, CardRequestsComponent, CardsWrapperRequestsComponent, HRRequestFormComponent, VoucherRequestFormComponent, ChangeManagerRequestFormComponent, ReferralRequestFormComponent, ManageCreateRequestsComponent, HRRequestsWrapperComponent, GeneralRequestsWrapperComponent, ManagersRequestsWrapperComponent, GounaVoucherRequestFormComponent, TrainingRequestFormComponent, PeerToPeerRequestFormComponent, LeaveRequestFormComponent, BalanceManagementFormComponent, CreateAllocationRequestFormComponent, ResignationRequestFormComponent, TerminationRequestFormComponent, CreateRecruitmentFormComponent, ExpenseRepaymentComponent, CreatePipFormComponent],
  imports: [
    MyRequestsRoutingModule,
    SharedModule,
    SharedComponentsModule,
    LeaveRequestModule,
    NgxsModule.forFeature([RequestsState])
  ],
  providers: [MyRequestsService]
})
export class MyRequestsModule { }
