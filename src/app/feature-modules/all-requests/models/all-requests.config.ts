export const REQUEST_ENDPOINTS_BASE = 'Request';

export const ALL_REQUESTS_STATUES_LIST = [
  {
    id: 0,
    name: 'In progress',
  },
  {
    id: 1,
    name: 'Applied',
  },
  {
    id: 2,
    name: 'Rejected',
  },
  {
    id: 3,
    name: 'Archived',
  },
  {
    id: 4,
    name: 'Deleted',
  },
  {
    id: 5,
    name: 'Failed',
  },
  {
    id: 6,
    name: 'Expired',
  },
  {
    id: 7,
    name: 'Closed',
  },
  {
    id: 8,
    name: 'Dismissed',
  },
];

export enum ALL_REQUESTS_STATUSES_ENUM {
  inProgress = 'In Progress',
  Applied = 'Applied',
  Rejected = 'Rejected',
  Archived = 'Archived',
  Deleted = 'Deleted',
  Expired = 'Expired',
  Failed = 'Failed',
  Closed = 'Closed',
  Dismissed = 'Dismissed',
  FailedProbation = 'Failed Probation, to be dismissed',
}

export enum ALL_REQUESTS_STATUSES_COLORS {
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
  FailedProbation = 'text-red-500',
}

export const ALL_REQUESTS_STATUSES = {
  0: 'In Progress',
  1: 'Applied',
  2: 'Rejected',
  3: 'Archived',
};
