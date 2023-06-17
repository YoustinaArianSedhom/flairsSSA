import * as REQUESTS_MODELS from '../../model/requests.models';



/*________________________ AUTO COMPLETE ACTIONS __________________*/
export class MySubsEmployeesAutoComplete {
  static readonly type = '[MY-REQUEST] employee Autocomplete';
  constructor(public employeeName: string) { }
}
export class GetAllMySubsEmployeesAutoComplete {
  static readonly type = '[MY-REQUEST] Get All MySubs Employees Auto Complete ';
  constructor(public employeeName: string) { }
}

export class ClearMySubsEmployeeAutoComplete {
  static readonly type = '[MY-REQUEST] Clear Autocomplete';
}

export class ManagersAutoComplete {
  static readonly type = '[MY-REQUEST] Manager Autocomplete';
  constructor(public managerName: string) { }
}

export class ClearManagersAutoComplete {
  static readonly type = '[MY-REQUEST] Clear Manager Autocomplete';
}
/*__________________________________Raise Request Form Actions_____________________*/
export class GetEntityInfoRaiseRequest {
  static readonly type = '[MY-REQUEST] Get Entity Info Raise Request';
  constructor(public employeeEmail: string) { }
}

export class ClearEntitiesListRaiseRequest {
  static readonly type = '[MY_REQUEST] Clear Entities List'
}


export class GetNewNetSalary {
  static readonly type = '[MY-REQUEST] Get New Net Salary';
  constructor(public body: REQUESTS_MODELS.NewNetSalaryConfigModel) { }
}
export class CreateRaiseRequest {
  static readonly type = '[MY-REQUESTS] Create Raise Request';
  constructor(public body: REQUESTS_MODELS.RaiseRequestBodyModel) { }
}

export class GetRaiseReasons {
  static readonly type = '[MY-REQUESTS] Get Raise Reasons'
}

/*__________________________________Promotion Request Form_______________________________*/

export class GetEntityInfoPromotionRequest {
  static readonly type = '[MY_REQUEST] Get Entity Info Promotion Request';
  constructor(public employeeEmail: string) { }
}

export class GetEmployeeInfoPromotionRequest {
  static readonly type = '[MY_REQUEST] Get Employee Info Promotion Request';
  constructor(public employeeEmail: string) { }
}
export class ClearEntitiesListPromotionRequest {
  static readonly type = '[MY_REQUEST] Clear Entities List'
}

export class GetPromotedJobsList {
  static readonly type = '[MY_REQUEST] Get Promotion Levels List';
}

export class CreatePromotionRequest {
  static readonly type = '[MY-REQUESTS] Create Promotion Request';
  constructor(public body: REQUESTS_MODELS.PromotionRequestBodyModel) { }
}

/*______________________________Change Management Actions___________________*/


export class CreateChangeManagerRequest {
  static readonly type = '[MY-REQUEST] Create Change Manager Request'
  constructor(public body: REQUESTS_MODELS.ChangeManagerRequestFormBodyModel) { }
}

/*__________________________________Voucher Request Form Actions_____________________*/
export class GetEntityInfoVoucherRequest {
  static readonly type = '[MY-REQUEST] Get Entity Info Voucher Request';
  constructor(public employeeEmail: string) { }
}


export class CreateVoucherRequest {
  static readonly type = '[MY-REQUESTS] Create Voucher Request';
  constructor(public body: REQUESTS_MODELS.VoucherRequestFormBodyModel) { }
}

export class ClearEntitiesListVoucherRequest {
  static readonly type = '[MY_REQUEST] Clear Entities List';
}


/*______________________________________Gouna Voucher Actions______________________________________*/
export class CreateGounaVoucherRequest {
  static readonly type = '[MY_REQUEST] Create Gouna Voucher Request'
  constructor(public body: REQUESTS_MODELS.GounaVoucherRequestFormBody) { }
}

/*______________________________________ Recruitment Actions______________________________________*/

export class CreateRecruitmentRequest {
  static readonly type = '[MY_REQUEST] Create Recruitment Request'
  constructor(public body: REQUESTS_MODELS.RecruitmentRequestFormBodyModel) { }
}

export class GetTeamPL{
  static readonly type = '[MY_REQUEST] Get TeamPL Request'
}

export class GetMyTeamDetails {
  static readonly type = '[MY_REQUEST] Get myTeam Request'
}
export class GetAllJobsWithLevels {
  static readonly type = '[MY_REQUEST] Get AllJobs Request'
}
export class GetDepartmentsWebAPI {
  static readonly type = '[MY_REQUEST] Get Departments Request'
}
export class GetAllShifts {
  static readonly type = '[MY_REQUEST] Get AllShifts Request'
}
export class GetAllSkills {
  static readonly type = '[MY_REQUEST] Get AllSkills Request'
}
export class GetCustomerSuccess {
  static readonly type = '[MY_REQUEST] Get CustomerSuccess Request'
}

// there's old method for Get My Accounts

export class GetMyAccounts {
  static readonly type = '[MY_REQUEST] Get MyAccounts Request'
}
export class GetProfileRoles {
  static readonly type = '[MY_REQUEST] Get ProfileRoles Request'
}
export class GetMyProducts {
  static readonly type = '[MY_REQUEST] Get MyProducts Request'
  constructor(public accountId:string){}
}
export class GetMyTeams {
  static readonly type = '[MY_REQUEST] Get MyTeams Request'
  constructor(public productId: string){}
}
export class GetClientRequester {
  static readonly type = '[MY_REQUEST] Get ClientRequester Request'
  constructor(public clientAccount:string){}
}

export class GetPositionLocations{
  static readonly type = '[MY_REQUEST] Get Position Locations'
}

/*______________________________________ Budget Actions______________________________________*/
export class GetMyCurrentMonthlyTeamBudget{
  static readonly type = '[MY_REQUEST] Get My Current Monthly Team Budget'
}

export class GetMoreDetailsRecruitment{
  static readonly type = '[MY_REQUEST] Get More Details Recruitment'
  constructor( public requestId: string) { }
}
export class UpdateRecruitmentRequest {
  static readonly type = '[MY_REQUEST] Update Recruitment Request'
  constructor(public body: REQUESTS_MODELS.RecruitmentRequestFormBodyModel) { }
}

/*______________________________________ Repayment Actions______________________________________*/
export class GetRepaymentTypes{
  static readonly type = '[MY_REQUEST] Get Repayment Types'
}

export class CreateNewExpenseRepaymentRequest {
  static readonly type = '[MY-REQUESTS] Create New Expense Repayment Request'
  constructor(public body:REQUESTS_MODELS.ExpenseRepaymentModel) { }
}

export class CreateNewPIPRequest {
  static readonly type = '[MY-REQUESTS] Create New PIP Request'
  constructor(public body:REQUESTS_MODELS.PIPModel) { }
}
