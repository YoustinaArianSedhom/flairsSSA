import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import * as REQUEST_DETAILS_ACTIONS from '@modules/common/request-details/state/request-details.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { RequestDetailsState, RequestDetailsStateModel } from '../../state/request-details.state';
import animations from '@modules/common/request-details/pages/request-details/request-details-animation'
import { SpinnerService } from '@core/modules/spinner/spinner.service';
import { HideSpinner } from '@core/modules/spinner/state/spinner.actions';
import { SpinnerState } from '@core/modules/spinner/state/spinner.state';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { SSAConfigInst } from 'src/app/config/app.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';

@Component({
  selector: 'ssa-support-request-details',
  templateUrl: './support-request-details.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 88.5vh;
      }
    `
  ],
  styleUrls: ['./support-request-details.component.scss'],
  animations
})
export class SupportRequestDetailsComponent implements OnInit, OnDestroy {

  @HostBinding('class') hostClass = 'fixed z-50 right-0 transition-opacity bottom-0 w-11/12 md:w-8/12 lg:w-5/12 bg-white pt-5 pb-10  shadow-2xl';

  @ViewSelectSnapshot(RequestDetailsState.raiseRequestDetails)
  public raiseRequestDetails: REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.promotionRequestDetails)
  public promotionRequestDetails: REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.HRLetterRequestDetails)
  public HRLetterRequestDetails: REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.changeManagerRequestDetails)
  public changeManagerRequestDetails: REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.voucherRequestDetails)
  public voucherRequestDetails: REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.referralRequestDetails)
  public referralRequestDetails: REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.gounaVoucherRequestDetails)
  public gounaVoucherRequestDetails: REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails;
  @ViewSelectSnapshot(RequestDetailsState.trainingRequestDetails)
  public trainingRequestDetails: REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.peerToPeerRequestDetails)
  public peerToPeerRequestDetails: REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.offerRequestDetails)
  public offerRequestDetails: REQUEST_DETAILS_MODELS.OfferDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.probationDetails) public probationDetails: REQUEST_DETAILS_MODELS.ProbationDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.LeaveDetails) public LeaveDetails: REQUEST_DETAILS_MODELS.LeaveDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.BlanaceManagementDetails) public BlanaceManagementDetails: REQUEST_DETAILS_MODELS.BalanceManagementModel;
  @ViewSelectSnapshot(RequestDetailsState.AllocationDetails) public AllocationDetails: REQUEST_DETAILS_MODELS.AllocationModel;
  @ViewSelectSnapshot(RequestDetailsState.UnpaidDetails) public UnpaidDetails: REQUEST_DETAILS_MODELS.UnpaidModel;
  @ViewSelectSnapshot(RequestDetailsState.noShowDetails) public noShowDetails: REQUEST_DETAILS_MODELS.NoShowDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.resignationDetails) public resignationDetails: REQUEST_DETAILS_MODELS.ResignationDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.recruitmentDetails) public recruitmentDetails: REQUEST_DETAILS_MODELS.RecruitmentDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.onBoardingDetails) public onBoardingDetails: REQUEST_DETAILS_MODELS.onBoardingDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.expenseRepaymentDetails) public expenseRepaymentDetails: REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel;
  @ViewSelectSnapshot(RequestDetailsState.pipDetails)public pipDetails: REQUEST_DETAILS_MODELS.PIPDetailsModel;

  @ViewSelectSnapshot(RequestDetailsState.requestDetails) public requestSummary: any;

  @Select(SpinnerState.loading) public loading$: Observable<boolean>



  @ViewSelectSnapshot(RequestDetailsState.internalTimelineDetails)
  public internalTimelineDetails: REQUEST_DETAILS_MODELS.TimelineDetailsModel[];

  public requestType: string;
  public requestId: string;
  private _closeSubscription : Subscription

  public state = 'opened';
  constructor(
    private _store: Store,
    private _route: ActivatedRoute,
    private _router: Router,
    private _spinner: SpinnerService,
    private _location: Location,
    private _snackbars: SnackBarsService
  ) {
    // if url has side-panel but doesn't include type in query param then we need to remove the sidepanel
    if (this._location.path().includes('side-panel') && (!this._route.snapshot.queryParams || (this._route.snapshot.queryParams && !this._route.snapshot.queryParams['type']))) {
      this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
    }
  }


  @HostBinding('@isVisibilityChanged') get isVisibilityChanged() {
    return this.state;
  }




  ngOnInit(): void {
    this._closeSubscription = this._route.params.subscribe(params => {
      this.requestType = SSAConfigInst.REQUEST_TYPES_CONFIG[this._route.snapshot.queryParams.type]
      this.requestId = params.id
    })
    
    this.openSupportDetails()
  }


  public closeRequestDetails() {
    this._router.navigate([{
      outlets: { 'side-panel': null }
    }])
  }

  public getRevertData(event) {
    this._store.dispatch(new REQUEST_DETAILS_ACTIONS.RevertRequest(this.requestSummary.id, event.auditId.auditId, event.choiceNote)).subscribe(() => this._snackbars.openSuccessSnackbar({
      message: SSAConfigInst.CRUD_CONFIG.successMessages.revert('Request-' + this.requestSummary.readableId),
    }))
    this.openSupportDetails()
  }

  public openSupportDetails() {
    switch (this.requestType) {
      case 'Raise': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetRaiseRequestDetails(this.requestId));
        break;
      case 'Promotion': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetPromotionRequestDetails(this.requestId));
        break;
      case 'HR Letter': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetHRLetterRequestDetails(this.requestId));
        break;
      case 'Change Management': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetChangeManagerRequestDetails(this.requestId));
        break;
      case 'Voucher': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetVoucherRequestDetails(this.requestId));
        break;
      case 'Referral Bonus': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetReferralRequestDetails(this.requestId));
        break;
      case 'Gouna Voucher': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetGounaVoucherRequestDetails(this.requestId));
        break;
      case 'Training': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetTrainingRequestDetails(this.requestId));
        break;
      case 'Peer-to-Peer': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetPeerToPeerRequestDetails(this.requestId));
        break;
      case 'Offer': this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetOfferRequestDetails(this.requestId));
        break;
      case 'Probation':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetProbationDetails(this.requestId));
        break;
      case 'Annual Leave':
      case 'Maternity Leave':
      case 'Sick Leave':
      case 'Military Leave':
      case 'Emergency Leave':
      case 'Bereavement Leave':
      case 'Half-day Leave':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetLeaveDetails(this.requestId, this._route.snapshot.queryParams.type));
        break;
      case 'Balance Management':
        console.log('balance case')
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetBalanceManagementDetails(this.requestId))
        break;
      case 'Allocation Request':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetAllocationDetails(this.requestId))
        break;
      case 'Unpaid Leave':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetUnpaidDetails(this.requestId))
        break;

      case 'No Show':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetNoShowDetails(this.requestId))
        break;

      case 'Resignation':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetResignationDetails(this.requestId))
        break;

      case 'Recruitment':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetRecruitmentDetails(this.requestId))
        break;

      case 'Onboarding':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetOnBoardingDetails(this.requestId))
        break;
      case 'Expense Repayment':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetExpenseRepaymentDetails(this.requestId))
        break;
      case 'PIP':
        this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetMoreDetailsPIP(this.requestId));
        break;
    }
    this._store.dispatch(new REQUEST_DETAILS_ACTIONS.GetInternalTimelineDetails(this.requestId))
  }

  ngOnDestroy() {
    this._closeSubscription.unsubscribe()
    this._store.dispatch(new StateOverwrite([RequestDetailsState, new RequestDetailsStateModel()]));
  }

}

