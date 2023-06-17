import { MyRequestModel } from './requests.models';
export const PROFILE_ENDPOINTS_BASE = 'Profile';
export const REQUESTS_ENDPOINTS_BASE = 'Request';
export const AUTH_ENDPOINT = "Auth"

export const REQUEST_STATUES_LIST = [
    {
        id: 0,
        name: 'In progress'
    }, {
        id: 1,
        name: 'Applied'
    }, {
        id: 2,
        name: 'Rejected'
    }, {
        id: 3,
        name: 'Archived'
    }, {
        id: 4,
        name: 'Deleted'
    }, {
        id: 5,
        name: 'Failed'
    },
    {
        id: 6,
        name: 'Expired'
    },
    {
        id: 7,
        name: 'Closed'
    },
    {
        id: 8,
        name: 'Dismissed'
    }
]


export enum REQUEST_STATUES_ENUM {
    inProgress = 'In Progress',
    Applied = "Applied",
    Rejected = "Rejected",
    Archived = "Archived",
    Deleted = "Deleted",
    Expired = 'Expired',
    Failed = 'Failed',
    Closed = 'Closed',
    Dismissed = 'Dismissed',
    FailedProbation = 'Failed Probation, to be dismissed'
}


export enum REQUEST_STATUSES_COLORS {
    inProgress = 'text-gray-500',
    Applied = 'text-teal-500',
    Approved = 'text-blue-500',
    Rejected = 'text-red-500',
    Archived = 'text-yellow-500',
    Deleted = 'text-red-700',
    Expired = 'text-black',
    Failed = 'text-gray-600',
    Closed = 'text-gray-700',
    Dismissed = 'text-gray-700',
    FailedProbation = 'text-red-500'
}


export const REQUEST_STATUES = {
    0: "In Progress",
    1: "Applied",
    2: "Rejected",
    3: "Archived",
}

export enum SNACKBAR_ERROR_MESSAGES {
    employeeEmail = 'Employee name is not found',
    newNetSalary = 'New net salary should not be less than zero',
    managerEmail = 'Manager name is not found',
    referrerEmail = 'Referrer name is not found',
    refereeEmail = 'Referee name is not found',
    duplicatedMangerAndEmployeeEmail = 'Employee email is same as new manager email',
    duplicatedReferrerAndReferee = 'Referrer email is same as referee email'
}


export const HR_REQUEST_LETTER_LANGUAGES_LIST = [
    {
        type: 'Arabic',
        id: 1
    },
    {
        type: 'English',
        id: 0
    },
]

export const BalanceRequestTypes = [
    {
        id: 0,
        name: 'Employee Name',
        value: 'employee'
    },
    {
        id: 1,
        name: 'Team Name',
        value: 'team'
    },
    {
        id: 2,
        name: 'All employees ',
        value: 'all'
    },

]

export const RecruitmentTypes = [
    {
        id: 0,
        name: 'New Hire',
    },
    {
        id: 1,
        name: 'Replacement',
    },

]

export const ExpenseRepaymentTypes = [
    {
        id: 0,
        name: 'Employee Name',
    },
    {
        id: 1,
        name: 'My Team',
    }

]

export const BalanceLeaveTypes = [
    {
        id: 0,
        name: 'Annual Leave',
    },
    {
        id: 1,
        name: 'Sick Leave',
    },
    {
        id: 2,
        name: 'Emergency Leave',
    },
];

export enum DAYS_OF_WEEK {
    Sun = 0,
    Mon = 1,
    Tue = 2,
    Wed = 3,
    Thu = 4,
    Fri = 5,
    Sat = 6,
}

export enum PRIORITIES_ENUM {
    Urgent = 30,
    High = 20,
    Medium = 10,
    Low = 0,
}

export enum ENGLISH_FLUENCY {
    Undefined = 0,
    Poor = 1,
    Average = 2,
    Good = 3,
    VeryGood = 4,
    Fluent = 5
}

export const EMPLOYMENT_TYPES = [
    {
        id: 0,
        name: 'Full time'
    },
    {
        id: 1,
        name: 'Part time'
    }
]

export const LOCATIONS = [
    "Cairo",
    "string",
    "data",
    "else"
]

export const ENGLISH_LEVELS_TYPES = ['Undefined', 'Poor', 'Average', 'Good', 'Very good', 'Fluent'];

export const cancelRequestHints = (record: MyRequestModel) => {
    let hintMessage = '';
    switch (record.workflowType) {
        case 25:
            hintMessage = 'Any “in progress” offer will continue its cycle, position will be closed, recruitment task will be closed'
            break;

        default:
            break;
    }

    return hintMessage
}
