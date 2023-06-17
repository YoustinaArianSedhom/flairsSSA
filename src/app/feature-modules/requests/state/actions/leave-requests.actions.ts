import * as REQUESTS_MODELS from '../../model/requests.models';

/*_______________________ Annual Leave Requests _______________________*/
export class GetMyLeaveBalance{
   static readonly type = '[MY_REQUESTS] Get My Leave Balance';
   constructor(public cycleId?: string) { }
}

export class GetCyclesByEmployeeCountry {
   static readonly type = '[MY_REQUESTS] Get Cycles By Employee Country';
}
export class CalculateLeaveDays{
   static readonly type = '[MY_REQUESTS] Calculate Leave Days';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}

export class resetLeaveDays{
   static readonly type = '[MY_REQUESTS] Reset Leave Days';
}
export class CreateNewAnnualLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Annual Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}

/*_______________________ Maternity Leave Requests _______________________*/

export class CreateNewMaternityLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Maternity Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}


/*_______________________ Sick Leave Requests _______________________*/

export class CreateNewSickLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Sick Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}


/*_______________________ Military Leave Requests _______________________*/

export class CreateNewMilitaryLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Military Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}

/*_______________________ Emergency Leave Requests _______________________*/

export class CreateNewEmergencyLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Emergency Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}

/*_______________________ Bereavement Leave Requests _______________________*/

export class CreateNewBereavementLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Bereavement Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}

/*_______________________ Half day Leave Request _______________________*/
export class CreateNewHalfDayLeaveRequest{
   static readonly type = '[MY_REQUESTS] Create New Half Day Leave Request';
   constructor(public body:REQUESTS_MODELS.LeaveRequestFormBodyModel){}
}
