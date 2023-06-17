import * as REQUEST_DETAILS_MODELS from '@modules/common/request-details/model/request-details.models';
export class GetRaiseRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Raise Request Details';
  constructor(public requestId: string) { }
}


export class GetPromotionRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Promotion Request Details';
  constructor(public requestId: string) { }
}


export class GetHRLetterRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get HR Letter Request Details';
  constructor(public requestId: string) { }
}

export class GetChangeManagerRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Change Manager Request Details';
  constructor(public requestId: string) { }
}
export class GetVoucherRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Voucher Request Details';
  constructor(public requestId: string) { }
}
export class GetReferralRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Referral Request Details';
  constructor(public requestId: string) { }
}
export class GetGounaVoucherRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Gouna Voucher Request Details';
  constructor(public requestId: string) { }
}
export class GetTrainingRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Training Request Details';
  constructor(public requestId: string) { }
}
export class GetPeerToPeerRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Peer To Peer Request Details';
  constructor(public requestId: string) { }
}

export class GetOfferRequestDetails {
  static readonly type = '[REQUEST_DETAILS] Get Offer Request Details';
  constructor(public requestId: string) { }
}

export class GetProbationDetails {
  static readonly type = '[REQUEST_DETAILS] Get Probation Details';
  constructor(public requestId: string) { }
}
export class GetLeaveDetails {
  static readonly type = '[REQUEST_DETAILS] Get Leave Details';
  constructor(public requestId: string, public requestType: number) { }
}

export class DownloadLeaveUploadedFile {
  static readonly type = '[REQUEST_DETAILS] Download Leave Uploaded File';
  constructor(public file: REQUEST_DETAILS_MODELS.DownloadLeaveFile) { }
}
export class DownloadExpenseReceiptFile {
  static readonly type = '[REQUEST_DETAILS] Download Expense Receipt Uploaded File';
  constructor(public fileData: REQUEST_DETAILS_MODELS.DownloadExpenseReceipt) { }
}
export class GetBalanceManagementDetails {
  static readonly type = '[REQUEST_DETAILS] Get Balance Management Details';
  constructor(public requestId: string) { }
}
export class GetAllocationDetails {
  static readonly type = '[REQUEST_DETAILS] Get Allocation Details';
  constructor(public requestId: string) { }
}
export class GetUnpaidDetails {
  static readonly type = '[REQUEST_DETAILS] Get Unpaid Details';
  constructor(public requestId: string) { }
}

export class GetNoShowDetails {
  static readonly type = '[REQUEST_DETAILS] Get No Show Details';
  constructor(public requestId: string) { }
}

export class GetTimelineDetails {
  static readonly type = '[REQUEST_DETAILS] Get Timeline Details';
  constructor(public requestId: string) { }
}
export class GetResignationDetails {
  static readonly type = '[REQUEST_DETAILS] Get Get Resignation Details';
  constructor(public requestId: string) { }
}
export class GetRecruitmentDetails {
  static readonly type = '[REQUEST_DETAILS] Get Recruitment Details';
  constructor(public requestId: string) { }
}
export class GetOnBoardingDetails {
  static readonly type = '[REQUEST_DETAILS] Get onBoarding Details';
  constructor(public requestId: string) { }
}
export class GetExpenseRepaymentDetails {
  static readonly type = '[REQUEST_DETAILS] Get Expense Repayment Details';
  constructor(public requestId: string) { }
}
export class GetMoreDetailsPIP {
  static readonly type = '[REQUEST_DETAILS] Get More Details PIP';
  constructor(public requestId: string) { }
}
export class GetInternalTimelineDetails {
  static readonly type = '[REQUEST_DETAILS] Get Internal Timeline Details';
  constructor(public requestId: string) { }
}
export class RevertRequest {
  static readonly type = '[REQUEST_DETAILS] Revert Request';
  constructor(public requestId: string, public auditId : string, public choiceNote: string) { }
}
