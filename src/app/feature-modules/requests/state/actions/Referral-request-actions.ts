import * as REQUESTS_MODELS from '../../model/requests.models';



/*__________________________________REFERRERS AUTOCOMPLETE ACTIONS __________________________________*/

export class GetAllEmployeesListAutoComplete {
    static readonly type = '[MY_REQUESTS] Referrers Autocomplete'
    constructor(public employeeName: string) { }
}

export class ClearAllEmployeesListAutocomplete {
    static readonly type = '[MY_REQUESTS] Clear Referrers Autocomplete'
}

/*__________________________________REFEREES AUTOCOMPLETE ACTIONS __________________________________*/
export class RefereesAutoComplete {
    static readonly type = '[MY_REQUESTS] Referees Autocomplete'
    constructor(public employeeName: string) { }
}

export class ClearRefereesAutoComplete {
    static readonly type = '[MY_REQUESTS] Clear Referees Autocomplete'
}

/*_________________________________________________ENTITY ACTIONS_____________________________________________________*/
export class GetEntityInfoReferralRequest {
    static readonly type = '[MY_REQUESTS] Get Entity Info Referral Request'
    constructor(public employeeEmail: string) { }
}

export class ClearEntitiesListReferralRequest {
    static readonly type = '[MY_REQUESTS] Clear Entities List Referral Request'
}

export class CreateReferralRequest {
    static readonly type = '[MY_REQUESTS] Create Referral Request'
    constructor(public body: REQUESTS_MODELS.ReferralRequestFormBodyModel) { }
}
