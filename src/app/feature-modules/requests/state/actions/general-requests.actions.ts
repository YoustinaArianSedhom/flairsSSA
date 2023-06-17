import * as REQUESTS_MODELS from '@modules/requests/model/requests.models'


/*___________________________________________HR Letter Request Actions________________________________________________________*/
export class GetMyUserInfo {
    static readonly type = '[MY-REQUEST] Get My User Info'
}

export class CreateHRRequest {
    static readonly type = '[MY-REQUEST] Create HR Request'
    constructor(public body: REQUESTS_MODELS.HRRequestFormBodyModel) { }
}



/*________________________________________Training Request Actions________________________________________*/
export class CreateTrainingRequest {
    static readonly type = '[MY-REQUESTS] Create Training Request'
    constructor(public body: REQUESTS_MODELS.TrainingRequestFormBody) { }
}


/*_________________________________________Peer To Peer Request Actions_________________________________________*/

export class CreatePeerToPeerRequest {
    static readonly type = '[MY-REQUESTS] Create Peer To Peer Request'
    constructor(public body: REQUESTS_MODELS.PeerToPeerRequestFormBodyModel) { }
}

/*_________________________________________ Balance Management Actions_________________________________________*/

export class GetAllCycles {
    static readonly type = '[MY-REQUESTS] Get All Cycles'
}

export class GetAllTeams {
    static readonly type = '[MY-REQUESTS] Get All Teams'
    constructor(public searchQuery: string) { }
}

export class SearchEmployees {
    static readonly type = '[MY-REQUESTS] Search Employees'
    constructor(public searchQuery: string, public exceptCurrentProfile: boolean) { }
}

export class CreateNewBalanceManagementRequest {
    static readonly type = '[MY-REQUESTS] Create New Balance Management Request'
    constructor(public body) { }
}

/*_________________________________________ Allocation Request Actions_________________________________________*/


export class GetMyJoinedEntity {
    static readonly type = '[MY-REQUESTS] Get My Joined Entity'
}

export class CreateAllocationRequest {
    static readonly type = '[MY-REQUESTS] Create New Allocation Request'
    constructor(public body) { }
}

/*_________________________________________ Resignation Request Actions_________________________________________*/

export class GetEmployeeResignationReasons {
    static readonly type = '[MY-REQUESTS] Get Employee Resignation Reasons'
}

export class CreateResignationRequest {
    static readonly type = '[MY-REQUESTS] Create Resignation Request'
    constructor(public body:REQUESTS_MODELS.ResignationRequestBodyModel) { }
}

export class CreateTerminationRequest{
    static readonly type = '[MY-REQUESTS] Create Termination Request'
    constructor(public body:REQUESTS_MODELS.TerminationRequestBodyModel) { }
    
}
