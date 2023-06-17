export const TASKS_ENDPOINTS_BASE = 'Request';




export const TASK_STATUS_OPTIONS = [
    {
        id: 0,
        name: 'Pending'
    },
    {
        id: 1,
        name: 'Done'
    }
]

export const enum TASKS_STATUS_ENUM {
    Approved = 'Approved',
    Rejected = 'Rejected',
    Applied = 'Applied'
}


export const SuccessSnackbar = (action: string) => {
    let successMessage;
    switch (action) {
        case 'Approve':
        case 'INJECT_APPROVAL_NOTE_LEAVE_DATA':
            successMessage = 'approved';
            break;
        case 'Apply':
        case 'INJECT_EMPLOYEE_REASON_NOSHOW':
        case 'DEMAND_REASON':
        case 'DISMISS':
        case 'BALANCE_DEDUCTION':
        case 'VALID':
            successMessage = 'applied';
            break;
        case 'Reject':
        case 'REJECT':
            successMessage = 'rejected';
            break;
        case 'INJECT_REJECTION_REASON_LEAVE_DATA':
            successMessage = 'rejected';
            break;
        case 'INJECT_FINANCE_P2P_DATA':
            successMessage = 'applied';
            break;
        case 'CLOSE_POSITION':
            successMessage = 'closed';
            break;
        default:
            successMessage = 'approved'
    }
    return successMessage;
}
