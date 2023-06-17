// List of roles to be used as the single trusted reference for all available roles cross over the whole system
export enum SystemRoles {
    Master = 'Master',
    CreateRaise = 'Create Raise',
    CreatePromotion = "Create Promotion",
    workflowManagement = "Workflow Management",
    PermissionManagement = "Permission Management",
    createHRLetterRequest = 'Create HR Letter',
    createChangeManager = 'Create Change Management',
    createVoucherRequest = 'Create Voucher',
    createReferralRequest = 'Create Referral Bonus',
    createGounaVoucher = 'Create Gouna',
    createTrainingRequest = 'Create Training',
    createPeerToPeer = 'Create Peer To Peer',
    createLeave = 'Create Leave',
    balanceManagement = 'Leave Management',
    leaveManagement = 'Leave Management',
    createAllocation = 'Create Allocation',
    viewTeamLeaves = 'View Team Leaves',
    createResignation = 'Create Resignation',
    createTermination = 'Create Termination',
    viewTeamRequests = 'View Team Requests',
    createRecruitment = 'Create Recruitment',
    createExpenseRepayment = 'Create Expense Repayment',
    viewExpenseRequests = 'View Expense Requests',
    createPIP = 'Create PIP',

    Employee = 'Employee',
    Manager = 'Direct Lead',
    PayrollManager = 'Manager',
    viewTeamTasks = 'View Team Tasks',
}

export const ROLES_key = 'profileRoles';
