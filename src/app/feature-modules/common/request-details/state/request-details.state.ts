import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as REQUEST_DETAILS_ACTIONS from './request-details.actions';
import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
import { RequestDetailsService } from '../model/request-details.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { downloadFile } from '@shared/helpers/download-file.helper';


export class RequestDetailsStateModel {
  public raiseRequestDetails: REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel;
  public promotionRequestDetails: REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel;
  public HRLetterRequestDetails: REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel;
  public changeManagerRequestDetails: REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel;
  public voucherRequestDetails: REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel;
  public referralRequestDetails: REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel;
  public gounaVoucherRequestDetails: REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails;
  public trainingRequestDetails: REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel
  public peerToPeerRequestDetails: REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel;
  public offerRequestDetails: REQUEST_DETAILS_MODELS.OfferDetailsModel;
  public probationDetails: REQUEST_DETAILS_MODELS.ProbationDetailsModel;
  public LeaveDetails: REQUEST_DETAILS_MODELS.LeaveDetailsModel;
  public BalanceManagemtDetails: REQUEST_DETAILS_MODELS.BalanceManagementModel;
  public AllocationDetails: REQUEST_DETAILS_MODELS.AllocationModel;
  public UnpaidDetails: REQUEST_DETAILS_MODELS.UnpaidModel;
  public noShowDetails: REQUEST_DETAILS_MODELS.NoShowDetailsModel;
  public resignationDetails: REQUEST_DETAILS_MODELS.ResignationDetailsModel;
  public recruitmentDetails: REQUEST_DETAILS_MODELS.RecruitmentDetailsModel;
  public onBoardingDetails: REQUEST_DETAILS_MODELS.onBoardingDetailsModel;
  public expenseRepaymentDetails: REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel;
  public pipDetails: REQUEST_DETAILS_MODELS.PIPDetailsModel;

  public timelineDetails: REQUEST_DETAILS_MODELS.TimelineDetailsModel[]
  public internalTimelineDetails: REQUEST_DETAILS_MODELS.TimelineDetailsModel[]

  public requestDetails: any


  constructor() {
    this.raiseRequestDetails = null;
    this.promotionRequestDetails = null;
    this.HRLetterRequestDetails = null;
    this.changeManagerRequestDetails = null;
    this.voucherRequestDetails = null;
    this.referralRequestDetails = null;
    this.gounaVoucherRequestDetails = null;
    this.peerToPeerRequestDetails = null
    this.offerRequestDetails = null;
    this.probationDetails = null;
    this.LeaveDetails = null;
    this.BalanceManagemtDetails = null;
    this.AllocationDetails = null;
    this.UnpaidDetails = null;
    this.noShowDetails = null;
    this.resignationDetails = null;
    this.recruitmentDetails = null;
    this.onBoardingDetails = null;
    this.expenseRepaymentDetails = null;
    this.pipDetails = null;

    this.timelineDetails = [];
    this.internalTimelineDetails = [];

    this.requestDetails = null;
  }
}

@Injectable()
@State<RequestDetailsStateModel>({
  name: 'requestDetails',
  defaults: new RequestDetailsStateModel()
})
export class RequestDetailsState {

  constructor(private _mainService: RequestDetailsService) { }



  @Selector() static raiseRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel {
    return state.raiseRequestDetails;
  }

  @Selector() static promotionRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel {
    return state.promotionRequestDetails;
  }

  @Selector() static HRLetterRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel {
    return state.HRLetterRequestDetails;
  }

  @Selector() static changeManagerRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel {
    return state.changeManagerRequestDetails
  }

  @Selector() static voucherRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel {
    return state.voucherRequestDetails
  }

  @Selector() static referralRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel {
    return state.referralRequestDetails
  }

  @Selector() static gounaVoucherRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails {
    return state.gounaVoucherRequestDetails
  }


  @Selector() static trainingRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel {
    return state.trainingRequestDetails
  }

  @Selector() static peerToPeerRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel {
    return state.peerToPeerRequestDetails
  }

  @Selector() static offerRequestDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.OfferDetailsModel {
    return state.offerRequestDetails
  }

  @Selector() static probationDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.ProbationDetailsModel {
    return state.probationDetails
  }

  @Selector() static LeaveDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.LeaveDetailsModel {
    return state.LeaveDetails
  }
  @Selector() static BlanaceManagementDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.BalanceManagementModel {
    return state.BalanceManagemtDetails
  }
  @Selector() static AllocationDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.AllocationModel {
    return state.AllocationDetails
  }
  @Selector() static UnpaidDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.UnpaidModel {
    return state.UnpaidDetails
  }

  @Selector() static noShowDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.NoShowDetailsModel {
    return state.noShowDetails
  }
  
  @Selector() static resignationDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.ResignationDetailsModel {
    return state.resignationDetails
  }

  @Selector() static recruitmentDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.RecruitmentDetailsModel{
    return state.recruitmentDetails
  }

  @Selector() static onBoardingDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.onBoardingDetailsModel{
    return state.onBoardingDetails
  }
  @Selector() static expenseRepaymentDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel{
    return state.expenseRepaymentDetails
  }
  
  @Selector() static pipDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.PIPDetailsModel{
    return state.pipDetails
  }


  @Selector() static timelineDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.TimelineDetailsModel[] {
    return state.timelineDetails;
  }

  @Selector() static requestDetails(state: RequestDetailsStateModel): any {
    return state.requestDetails;
  }

  @Selector() static internalTimelineDetails(state: RequestDetailsStateModel): REQUEST_DETAILS_MODELS.TimelineDetailsModel[] {
    return state.internalTimelineDetails;
  }


  /* _______________________ REQUEST DETAILS REDUCERS _______________________________ */
  @Action(REQUEST_DETAILS_ACTIONS.GetRaiseRequestDetails)
  public getRaiseRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetRaiseRequestDetails) {
    return this._mainService.getRaiseRequestDetails(requestId).pipe(
      tap((raiseRequestDetails: REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel) => patchState({ raiseRequestDetails, requestDetails: raiseRequestDetails}))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetPromotionRequestDetails)
  public getPromotionRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetPromotionRequestDetails) {
    return this._mainService.getPromotionRequestDetails(requestId).pipe(
      tap((promotionRequestDetails: REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel) => patchState({ promotionRequestDetails, requestDetails: promotionRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetHRLetterRequestDetails)
  public getHRLetterRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetHRLetterRequestDetails) {
    return this._mainService.getHRLetterRequestDetails(requestId).pipe(
      tap((HRLetterRequestDetails: REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel) => patchState({ HRLetterRequestDetails, requestDetails: HRLetterRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetChangeManagerRequestDetails)
  public getChangeManagerRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetChangeManagerRequestDetails) {
    return this._mainService.getChangeManagerRequestDetails(requestId).pipe(
      tap((changeManagerRequestDetails: REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel) => patchState({ changeManagerRequestDetails, requestDetails: changeManagerRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetVoucherRequestDetails)
  public getVoucherRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetVoucherRequestDetails) {
    return this._mainService.getVoucherRequestDetails(requestId).pipe(
      tap((voucherRequestDetails: REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel) => patchState({ voucherRequestDetails, requestDetails: voucherRequestDetails}))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetReferralRequestDetails)
  public getReferralRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetReferralRequestDetails) {
    return this._mainService.getReferralRequestDetails(requestId).pipe(
      tap((referralRequestDetails: REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel) => patchState({ referralRequestDetails, requestDetails: referralRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetGounaVoucherRequestDetails)
  public getGounaVoucherRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetGounaVoucherRequestDetails) {
    return this._mainService.getGounaVoucherRequestDetails(requestId).pipe(
      tap((gounaVoucherRequestDetails: REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails) => patchState({ gounaVoucherRequestDetails, requestDetails: gounaVoucherRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetTrainingRequestDetails)
  public getTrainingRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetTrainingRequestDetails) {
    return this._mainService.getTrainingRequestDetails(requestId).pipe(
      tap((trainingRequestDetails: REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel) => patchState({ trainingRequestDetails, requestDetails: trainingRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetPeerToPeerRequestDetails)
  public getPeerToPeerRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetPeerToPeerRequestDetails) {
    return this._mainService.getPeerToPeerRequestDetails(requestId).pipe(
      tap((peerToPeerRequestDetails: REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel) => patchState({ peerToPeerRequestDetails, requestDetails: peerToPeerRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetOfferRequestDetails)
  public getOfferRequestDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetOfferRequestDetails) {
    return this._mainService.getOfferRequestDetails(requestId).pipe(
      tap((offerRequestDetails: REQUEST_DETAILS_MODELS.OfferDetailsModel) => patchState({ offerRequestDetails, requestDetails: offerRequestDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetProbationDetails)
  public GetProbationDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetProbationDetails) {
    return this._mainService.getProbationDetails(requestId).pipe(
      tap((probationDetails: REQUEST_DETAILS_MODELS.ProbationDetailsModel) => patchState({ probationDetails, requestDetails: probationDetails }))
    )
  }


  @Action(REQUEST_DETAILS_ACTIONS.GetLeaveDetails)
  public GetLeaveDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId, requestType }: REQUEST_DETAILS_ACTIONS.GetLeaveDetails) {
    return this._mainService.GetLeaveDetails(requestId, requestType).pipe(
      tap((LeaveDetails: REQUEST_DETAILS_MODELS.LeaveDetailsModel) => {
        const date = new Date(LeaveDetails.to);
        date.setDate(date.getDate() - 1)
        LeaveDetails.to = date

        patchState({ LeaveDetails, requestDetails: LeaveDetails })
      })
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetNoShowDetails)
  public GetNoShowDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }:REQUEST_DETAILS_ACTIONS.GetNoShowDetails){
    return this._mainService.getMoreDetailsNoShow(requestId).pipe(
      tap((noShowDetails:REQUEST_DETAILS_MODELS.NoShowDetailsModel)=>patchState({noShowDetails, requestDetails: noShowDetails}))
    )
  }
  @Action(REQUEST_DETAILS_ACTIONS.GetResignationDetails)
  public GetResignationDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetResignationDetails) {
    return this._mainService.getMoreDetailsResignation(requestId).pipe(
      tap((resignationDetails: REQUEST_DETAILS_MODELS.ResignationDetailsModel) => patchState({ resignationDetails, requestDetails: resignationDetails }))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetRecruitmentDetails)
  public GetRecruitmentDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetRecruitmentDetails) {
    return this._mainService.getRecruitmentDetails(requestId).pipe(
      tap((recruitmentDetails: REQUEST_DETAILS_MODELS.RecruitmentDetailsModel) => {
          //detecting the comment if it includes url and if exist, it will be transferred to url HTML
          const regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
          
          recruitmentDetails.instanceComments.forEach(comment=>{
            const val = regex.exec(comment.content);
            if(val){
              const subst = `<a href="${val[0]}" target="_blank">${val[0]}</a>`; 
              const result = comment.content.replace(regex, subst);
              comment.content = result
            }
          })
          patchState({ recruitmentDetails, requestDetails: recruitmentDetails })}
        )
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.GetOnBoardingDetails)
  public GetOnBoardingDetails({patchState}: StateContext<RequestDetailsStateModel>, {requestId}: REQUEST_DETAILS_ACTIONS.GetOnBoardingDetails) {
    return this._mainService.getOnBoardingDetails(requestId).pipe(
      tap((onBoardingDetails: REQUEST_DETAILS_MODELS.onBoardingDetailsModel) => patchState({onBoardingDetails, requestDetails: onBoardingDetails}))
    )
  }
  @Action(REQUEST_DETAILS_ACTIONS.GetExpenseRepaymentDetails)
  public GetExpenseRepaymentDetails({patchState}: StateContext<RequestDetailsStateModel>, {requestId}: REQUEST_DETAILS_ACTIONS.GetExpenseRepaymentDetails) {
    return this._mainService.getExpenseRepaymentDetails(requestId).pipe(
      tap((expenseRepaymentDetails: REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel) => patchState({expenseRepaymentDetails, requestDetails: expenseRepaymentDetails}))
    )
  }

  @Action(REQUEST_DETAILS_ACTIONS.DownloadLeaveUploadedFile)
  public DownloadLeaveUploadedFile({ }: StateContext<RequestDetailsStateModel>, { file }: REQUEST_DETAILS_ACTIONS.DownloadLeaveUploadedFile) {
    const requestId = file.requestId;
    const fileId = file.fileId;
    return this._mainService.DownloadLeaveUploadedFile({ requestId, fileId }).pipe(
      tap((res) => {
        downloadFile(res.body, file.fileName, 'application/octet-stream');
      })
    );
  }

  @Action(REQUEST_DETAILS_ACTIONS.DownloadExpenseReceiptFile)
  public DownloadExpenseReceiptFile({ }: StateContext<RequestDetailsStateModel>, { fileData }: REQUEST_DETAILS_ACTIONS.DownloadExpenseReceiptFile) {
    return this._mainService.downloadExpenseReceipt(fileData).pipe(
      tap((res) => {
        downloadFile(res.body, fileData.fileName, 'application/octet-stream');
      })
    );
  }

  /*________________________________Blanace Management Details Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.GetBalanceManagementDetails)
  public BlanaceManagementDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetBalanceManagementDetails) {
    return this._mainService.GetBalanceManagementDetails(requestId).pipe(
      tap((BalanceManagemtDetails: REQUEST_DETAILS_MODELS.BalanceManagementModel) => patchState({ BalanceManagemtDetails, requestDetails: BalanceManagemtDetails }))
    )
  }
  /*________________________________Allocation Details Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.GetAllocationDetails)
  public AllocationDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetAllocationDetails) {
    return this._mainService.GetAllocationDetails(requestId).pipe(
      tap((AllocationDetails: REQUEST_DETAILS_MODELS.AllocationModel) => patchState({ AllocationDetails, requestDetails: AllocationDetails }))
    )
  }

  /*________________________________Unpaid Details Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.GetUnpaidDetails)
  public UnpaidDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetUnpaidDetails) {
    return this._mainService.GetUnpaidDetails(requestId).pipe(
      tap((UnpaidDetails: REQUEST_DETAILS_MODELS.UnpaidModel) => patchState({ UnpaidDetails, requestDetails:  UnpaidDetails}))
    )
  }
  /*________________________________ PIP Request Details Reducers____________________________*/

  @Action(REQUEST_DETAILS_ACTIONS.GetMoreDetailsPIP)
  public GetMoreDetailsPIP({ patchState }: StateContext<RequestDetailsStateModel>,{ requestId }: REQUEST_DETAILS_ACTIONS.GetMoreDetailsPIP){
    return this._mainService.getMoreDetailsPIP(requestId).pipe(
      tap((pipDetails: REQUEST_DETAILS_MODELS.PIPDetailsModel)=> patchState({pipDetails, requestDetails: pipDetails}))
    )
  }
  /*________________________________Timeline Details Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.GetTimelineDetails)
  public getTimelineDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetTimelineDetails) {
    return this._mainService.getTimeline(requestId).pipe(
      tap((timelineDetails: REQUEST_DETAILS_MODELS.TimelineDetailsModel[]) => patchState({ timelineDetails }))
    )
  }
  /*________________________________Internal Timeline Details Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.GetInternalTimelineDetails)
  public getInternalTimelineDetails({ patchState }: StateContext<RequestDetailsStateModel>, { requestId }: REQUEST_DETAILS_ACTIONS.GetInternalTimelineDetails) {
    return this._mainService.getInternalTimeline(requestId).pipe(
      tap((internalTimelineDetails: REQUEST_DETAILS_MODELS.TimelineDetailsModel[]) => patchState({ internalTimelineDetails }))
    )
  }

  /*________________________________Revert Request Reducers____________________________*/
  @Action(REQUEST_DETAILS_ACTIONS.RevertRequest)
  public revertRequest({  }: StateContext<RequestDetailsStateModel>, { requestId, auditId, choiceNote }: REQUEST_DETAILS_ACTIONS.RevertRequest) {
    return this._mainService.revertRequest({ requestId, auditId, choiceNote }).pipe(
      tap(() => {
      })
    )
  }
}
