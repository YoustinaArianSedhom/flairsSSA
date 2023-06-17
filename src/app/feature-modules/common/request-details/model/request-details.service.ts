import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LEAVE_REQUEST_API, REQUESTS_DETAILS_ENDPOINTS_BASE } from './request-details.config';
import * as REQUEST_DETAILS_MODELS from './request-details.models';

@Injectable({
  providedIn: 'root'
})
export class RequestDetailsService {
  constructor(
    private _http: HttpService
  ) { }




  public getRaiseRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsRaise${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.RaiseRequestDetailsModel>) => res.result)
    )
  }

  public getPromotionRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsPromotion${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.PromotionRequestDetailsModel>) => res.result)
    )
  }

  public getHRLetterRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsHRLetter${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.HRLetterRequestDetailsModel>) => res.result)
    )
  }

  public getChangeManagerRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsChangeManagement${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.ChangeManagerRequestDetailsModel>) => res.result)
    )
  }

  public getVoucherRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsVoucher${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.VoucherRequestDetailsModel>) => res.result)
    )
  }

  public getReferralRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsReferralBonus${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.ReferralRequestDetailsModel>) => res.result)
    )
  }

  public getGounaVoucherRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsGouna${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.GounaVoucherRequestDetails>) => res.result)
    )
  }

  public getTrainingRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsTraining${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.TrainingRequestDetailsModel>) => res.result)
    )
  }

  public getPeerToPeerRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsPeerToPeer${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.PeerToPeerRequestDetailsModel>) => res.result)
    )
  }

  public getOfferRequestDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.OfferDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsOffer${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.OfferDetailsModel>) => res.result)
    )
  }

  public getProbationDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.ProbationDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsProbation${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.ProbationDetailsModel>) => res.result)
    )
  }

  public GetLeaveDetails(requestId: string, requestType: number): Observable<REQUEST_DETAILS_MODELS.LeaveDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/${LEAVE_REQUEST_API[requestType]}${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.LeaveDetailsModel>) => res.result)
    )
  }

  public DownloadLeaveUploadedFile(body: { requestId: string, fileId: string }) {
    return this._http.post(
      `${REQUESTS_DETAILS_ENDPOINTS_BASE}/DownloadUploadedFile${buildQueryString({
        ...body
      })}`, {},
      { observe: 'response', responseType: 'blob' }
    );
  }

  /*_________________________________________Balance Management______________________________________*/
  public GetBalanceManagementDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.BalanceManagementModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsBalanceManagement${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.BalanceManagementModel>) => res.result)
    )
  }
  /*_________________________________________Allocation Details______________________________________*/
  public GetAllocationDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.AllocationModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsAllocation${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.AllocationModel>) => res.result)
    )
  }
  /*_________________________________________Unpaid Details______________________________________*/
  public GetUnpaidDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.UnpaidModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsUnPaidLeave${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.UnpaidModel>) => res.result)
    )
  }

  /*_________________________________________ No Show Details______________________________________*/
  public getMoreDetailsNoShow(requestId: string): Observable<REQUEST_DETAILS_MODELS.NoShowDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsNoShow${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.NoShowDetailsModel>) => res.result)
    )
  }
  /*__________________________________________Timeline______________________________________*/
  public getTimeline(requestId: string): Observable<REQUEST_DETAILS_MODELS.TimelineDetailsModel[]> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetTimeline${buildQueryString({ requestId })}`).pipe(
      map(
        (res: ApiResponse<REQUEST_DETAILS_MODELS.TimelineDetailsModel[]>) => {
          return res.result
        }
      )
    )
  }

  /*_________________________________________ Resignation Details______________________________________*/
  public getMoreDetailsResignation(requestId: string): Observable<REQUEST_DETAILS_MODELS.ResignationDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsResignation${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.ResignationDetailsModel>) => res.result)
    )
  }

  /*_________________________________________ Recruitment Details______________________________________*/
  public getRecruitmentDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.RecruitmentDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsRecruitment${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.RecruitmentDetailsModel>) => res.result))
  }

  /*_________________________________________ OnBoarding Details______________________________________*/
  public getOnBoardingDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.onBoardingDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsOnBoarding${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.onBoardingDetailsModel>) => res.result)
    )
  }
  /*_________________________________________ Expense Repayment Details______________________________________*/
  public getExpenseRepaymentDetails(requestId: string): Observable<REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetMoreDetailsExpenseRepayment${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.expenseRepaymentDetailsModel>) => res.result)
    )
  }

  public downloadExpenseReceipt(body: REQUEST_DETAILS_MODELS.DownloadExpenseReceipt) {
    return this._http.post(
      `${REQUESTS_DETAILS_ENDPOINTS_BASE}/DownloadExpenseReceipt${buildQueryString({
        requestId:body.requestId
      })}`, {receipt :body.file},
      { observe: 'response', responseType: 'blob' }
    );
  }

  /*_________________________________________ PIP Request Details______________________________________*/
  public getMoreDetailsPIP(requestId: string): Observable<REQUEST_DETAILS_MODELS.PIPDetailsModel> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/getMoreDetailsPIP${buildQueryString({ requestId })}`).pipe(
      map((res: ApiResponse<REQUEST_DETAILS_MODELS.PIPDetailsModel>) => res.result)
    )
  }

   /*__________________________________________Internal Timeline______________________________________*/
   public getInternalTimeline(requestId: string): Observable<REQUEST_DETAILS_MODELS.TimelineDetailsModel[]> {
    return this._http.fetch(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/GetInternalTimeline${buildQueryString({ requestId })}`).pipe(
      map(
        (res: ApiResponse<REQUEST_DETAILS_MODELS.TimelineDetailsModel[]>) => {
          return res.result
        }
      )
    )
  }

   /*__________________________________________Revert Request______________________________________*/
   public revertRequest(body:{requestId: string, auditId: string, choiceNote: string}): Observable<boolean> {
    body.choiceNote = body.choiceNote.split('\n').join('%0D%0A')
    return this._http.post(`${REQUESTS_DETAILS_ENDPOINTS_BASE}/RevertRequest${buildQueryString( body )}`).pipe(
      map(
        (res: ApiResponse<boolean>) => {
          return res.result
        }
      )
    )
  }
}
