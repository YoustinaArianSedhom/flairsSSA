export const REQUESTS_DETAILS_ENDPOINTS_BASE = 'Request';


export const HALF_DAY_LEAVE_TYPES = {
    0: 'First Half-day',
    1: 'Second Half-day',

}

export const LEAVE_REQUEST_API = {
    12: 'GetMoreDetailsAnnualLeave',
    13: 'GetMoreDetailsMaternityLeave',
    14: 'GetMoreDetailsSickLeave',
    15: 'GetMoreDetailsMilitaryLeave',
    16: 'GetMoreDetailsEmergencyLeave',
    17: 'GetMoreDetailsBereavementLeave',
    22: 'GetMoreDetailsHalfDayLeave'
}
export const VOUCHER_REQUEST_TYPES_CONFIG = {
    0: 'Addition',
    1: 'Customer Bonus'
}

export enum REQUEST_STATUES_ENUM {
    inProgress = 'In Progress',
    Applied = "Applied",
    Rejected = "Rejected",
    Archived = "Archived",
    Deleted = "Deleted"
}


export enum REQUEST_STATUSES_COLORS {
    inProgress = 'text-gray-500',
    Applied = 'text-teal-500',
    Approved = 'text-blue-500',
    Rejected = 'text-red-500',
    Archived = 'text-yellow-500',
    Deleted = 'text-red-700',
}

export enum REQUEST_STATUSES_BG_COLORS {
    inProgress = 'bg-gray-500',
    Applied = 'bg-teal-500',
    Approved = 'bg-blue-500',
    Rejected = 'bg-red-500',
    Archived = 'bg-yellow-500',
    Deleted = 'bg-red-700',
}

export const EMPLOYMENT_TYPES = {
    0: 'Full Time',
    1: 'Part Time'
}

export const ACTIONS_BUTTONS_CLASSES = {
    1: 'action-btn',
    2: 'cancel-btn',
    3: 'success-btn'
}
export const CONTRACT_TYPE = {
    0: 'Billable',
    1: 'Complementary',
    2: 'Time & Materials'
}
