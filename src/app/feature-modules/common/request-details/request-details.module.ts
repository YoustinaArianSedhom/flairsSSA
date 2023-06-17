import { NgModule } from '@angular/core';
import { RequestDetailsRoutingModule } from './request-details-routing.module';
import { SharedModule } from '@shared/shared.module';
import { RequestDetailsComponent } from './pages/request-details/request-details.component';
import { RequestDetailsHeaderComponent } from './components/request-details-header/request-details-header.component';
import { PromotionRequestDetailsComponent } from './components/promotion-request-details/promotion-request-details.component';
import { RaiseRequestDetailsComponent } from './components/raise-request-details/raise-request-details.component';
import { TimelineWrapperComponent } from './components/timeline-wrapper/timeline-wrapper.component';
import { RequestDetailsService } from './model/request-details.service';
import { NgxsModule } from '@ngxs/store';
import { RequestDetailsState } from './state/request-details.state';
import { RequestDetailsSummaryComponent } from './components/request-details-summary/request-details-summary.component';
import { HRLetterRequestDetailsComponent } from './components/hr-letter-request-details/hr-letter-request-details.component';
import { ChangeManagerRequestDetailsComponent } from './components/change-manager-request-details/change-manager-request-details.component';
import { VoucherRequestDetailsComponent } from './components/voucher-request-details/voucher-request-details.component';
import { ReferralRequestDetailsComponent } from './components/referral-request-details/referral-request-details.component';
import { GounaVoucherRequestDetailsComponent } from './components/gouna-voucher-request-details/gouna-voucher-request-details.component';
import { TrainingRequestDetailsComponent } from './components/training-request-details/training-request-details.component';
import { PeerToPeerRequestDetailsComponent } from './components/peer-to-peer-request-details/peer-to-peer-request-details.component';
import { MyTasksState } from '@modules/my-tasks/state/my-tasks.state';
import { OfferRequestDetailsComponent } from './components/offer-request-details/offer-request-details.component';
import { ProbationDetailsComponent } from '@modules/common/request-details/components/probation-details/probation-details.component';
import { BalanaceManagementComponent } from './components/balanace-management/balanace-management.component';
import { AllocationDetailsComponent } from './components/allocation-details/allocation-details.component';
import { UnpaidDetailsComponent } from './components/unpaid-details/unpaid-details.component';
import { LeaveDetailsComponent } from './components/leave-Details/leave-details.component';
import { NoShowDetailsComponent } from './components/no-show-details/no-show-details.component';
import { ResignationDetailsComponent } from './components/resignation-details/resignation-details.component';
import { DecimalPipe } from '@angular/common';
import { RecruitmentDetailsComponent } from './components/recruitment-details/recruitment-details.component';
import { OnBoardingDetailsComponent } from './components/on-boarding-details/on-boarding-details.component';
import { ExpenseRepaymentDetailsComponent } from './expense-repayment-details/expense-repayment-details.component';
import { BeneficiariesComponent } from './expense-repayment-details/beneficiaries/beneficiaries.component';
import { OnBoardingDocumentsComponent } from './components/on-boarding-details/on-boarding-documents/on-boarding-documents.component';
import { PipDetailsComponent } from './components/pip-details/pip-details.component';
import { RevertModalComponent } from './components/revert-modal/revert-modal.component';
import { SupportRequestDetailsComponent } from './pages/support-request-details/support-request-details.component';


@NgModule({
  declarations: [
    RequestDetailsComponent,
    RequestDetailsHeaderComponent,
    PromotionRequestDetailsComponent,
    RaiseRequestDetailsComponent,
    TimelineWrapperComponent,
    RequestDetailsSummaryComponent,
    HRLetterRequestDetailsComponent,
    ChangeManagerRequestDetailsComponent,
    VoucherRequestDetailsComponent,
    ReferralRequestDetailsComponent,
    GounaVoucherRequestDetailsComponent,
    TrainingRequestDetailsComponent,
    PeerToPeerRequestDetailsComponent,
    OfferRequestDetailsComponent,
    ProbationDetailsComponent,
    LeaveDetailsComponent,
    BalanaceManagementComponent,
    AllocationDetailsComponent,
    UnpaidDetailsComponent,
    NoShowDetailsComponent,
    ResignationDetailsComponent,
    RecruitmentDetailsComponent,
    OnBoardingDetailsComponent,
    ExpenseRepaymentDetailsComponent,
    BeneficiariesComponent,
    OnBoardingDocumentsComponent,
    PipDetailsComponent,
    RevertModalComponent,
    SupportRequestDetailsComponent

  ],
  imports: [
    RequestDetailsRoutingModule,
    SharedModule,

    NgxsModule.forFeature([RequestDetailsState,MyTasksState])

  ],
  providers: [RequestDetailsService, DecimalPipe]
})
export class RequestDetailsModule { }
