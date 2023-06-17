export * from './actions/my-requests.actions';
export * from './actions/general-requests.actions';
export * from './actions/Referral-request-actions';
export * from './actions/managers-requests.actions';
export * from './actions/leave-requests.actions';


export class GetDepartmentsList {
    static readonly type = '[REQUESTS] Get Departments List';
}

export class ExportMyRequests {
    static readonly type = '[REQUESTS] Export My Requests';
}

export class ToggleShowDetails {
    static readonly type = '[REQUESTS] Toggle Show Details';
}

