export const REQUEST_ENDPOINTS_BASE = 'Request';

export const MY_TEAM_REQUESTS_TYPES_LIST = [
   {
      name: 'Raise',
      id: 0
   }, {
      name: 'Promotion',
      id: 1
   },
   {
      name: 'HR Letter',
      id: 2
   },
   {
      id: 3,
      name: 'Change Management'
   },
   {
      id: 4,
      name: 'Voucher'
   },
   {
      id: 5,
      name: 'Referral Bonus'
   },
   {
      id: 6,
      name: 'Gouna Voucher'
   }, {
      id: 7,
      name: 'Training'
   },
   {
      id: 8,
      name: 'Peer-to-Peer'
   },
   {
      id: 9,
      name: 'Offer',
   },
   {
      id: 11,
      name: 'Probation'
   },
   {
      id: 23,
      name: 'Resignation'
   },
   {
      id: 25,
      name: 'Recruitment'
   },
   {
      id: 26,
      name: 'Expense Repayment',
   },
   {
      id: 27,
      name: 'PIP'
   }
]

export const MY_TEAM_REQUESTS_STATUSES_LIST = [
   {
      id: 0,
      name: 'In progress'
   }, {
      id: 1,
      name: 'Applied'
   }, {
      id: 2,
      name: 'Rejected'
   },
   {
      id: 3,
      name: 'Archived'
   },
   {
      id: 4,
      name: 'Deleted'
   },
   {
      id: 5,
      name: 'Failed'
   },
   {
      id: 8,
      name: 'Dismissed'
   }
];
export const REQUEST_TYPES_CONFIG = {
   0: 'Raise',
   1: 'Promotion',
   2: 'HR Letter',
   3: 'Change Management',
   4: 'Voucher',
   5: 'Referral Bonus',
   6: 'Gouna Voucher',
   7: 'Training',
   8: 'Peer-to-Peer',
   9: 'Offer',
   11: 'Probation',
   23: 'Resignation',
   25: 'Recruitment',
   26:'Expense Repayment',
   27: 'PIP'
   // //should be hidden
   // 12: 'Annual Leave',
   // 13: 'Maternity Leave',
   // 14: 'Sick Leave',
   // 15: 'Military Leave',
   // 16: 'Emergency Leave',
   // 17: 'Bereavement Leave',
   // 18: 'Balance Management',
   // 19: 'Allocation Request',
   // 20: 'Unpaid Leave',
   // 21: 'No Show',
   // 22: 'Half-day Leave'
}

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

