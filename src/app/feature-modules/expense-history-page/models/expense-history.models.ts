export const REQUEST_ENDPOINT = 'Request';
export const PROFILE_ENDPOINT = 'Profile';
export interface ExpenseFiltrationModel {
   searchQuery?: string;
   managerOrganizationEmail?: string;
   sortType?: number;
   from?: string;
   to?: string;
   states?: number[];
}
export interface ExpenseModel {
   expenseTypeName: string;
   amount: number;
   repaymentType: string;
   dueDate: Date;
   beneficiaries: Issuer[];
   isOutOfBudget: boolean;
   uploadedReceiptPaths: UploadedReceiptPath[];
   rejectionNote: null;
   receiptRejectionNote: null;
   id: string;
   readableId: number;
   createdDate: Date;
   lastModifiedDate: Date;
   workflowType: number;
   workflowTypeName: string;
   currentStateType: number;
   requestStatus: string;
   issuer: Issuer;
   issuerManager: Issuer;
   targetEmployee: Issuer;
   instanceNote: string;
   currentAssignees: any[];
   availableChoices: null;
   taskName: string;
}

export interface Issuer {
   fullName: string;
   organizationEmail: string;
}

export interface UploadedReceiptPath {
   fileName: string;
   file: string;
}

export interface ManagerModel {
   id:                string;
   fullName:          string;
   organizationEmail: string;
   department:        Department;
}

export interface Department {
   id:   string;
   name: string;
   code: string;
}
