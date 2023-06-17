export const REQUEST_ENDPOINTS_BASE = 'Request';

export const MY_TEAM_LEAVE_TYPES_LIST = [

   {
      id: 12,
      name: 'Annual Leave'
   },
   {
      id: 13,
      name: 'Maternity Leave'
   },
   {
      id: 14,
      name: 'Sick Leave'
   },
   {
      id: 15,
      name: 'Military Leave'
   },
   {
      id: 16,
      name: 'Emergency Leave'
   },
   {
      id: 17,
      name: 'Bereavement Leave'
   },
   {
      id: 18,
      name: 'Balance Management'
   },
   {
      id: 19,
      name: 'Allocation'
   },
   {
      id: 20,
      name: 'Unpaid Leave'
   },
   {
      id: 21,
      name: 'No Show'
   },
   {
      id: 22,
      name: 'Half-day Leave'
   }
]

export const MY_TEAM_LEAVE_STATUSES_LIST = [
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
   12: 'Annual Leave',
   13: 'Maternity Leave',
   14: 'Sick Leave',
   15: 'Military Leave',
   16: 'Emergency Leave',
   17: 'Bereavement Leave',
   18: 'Balance Management',
   19: 'Allocation Request',
   20: 'Unpaid Leave',
   21: 'No Show',
   22: 'Half-day Leave'
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

