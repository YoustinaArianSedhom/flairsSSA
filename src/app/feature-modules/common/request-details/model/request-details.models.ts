import { EmployeeModel } from '@modules/requests/model/requests.models';
import { IssuerModel, TargetEmployeeModel } from '@shared/models/shared.model';
/*________________________________________Request Details Models____________________________________*/
interface RequestDetailsModel {
  id: string;
  readableId: number;
  createdDate: Date;
  lastModifiedDate: Date;
  workflowType: number;
  workflowTypeName: string;
  requestStatus: string;
  issuer: IssuerModel;
  issuerManager: IssuerModel;
  targetEmployee: TargetEmployeeModel;
  instanceNote: string;
  currentAssignees: [
    {
      identifier: string;
      type: number;
    }
  ];
  availableChoices: AvailableChoicesModel[];
  entityId: number;
  entityName: string;
  department: string;
  departmentCode?: string;
  currentStateType: number;
  instanceComments: CommentModel[];
}

export interface AvailableChoicesModel {
  displayName: string;
  identifier: string;
  type: number;
  icon: string;
  note: string;
}

export interface RaiseRequestDetailsModel extends RequestDetailsModel {
  oldGrossSalary: number;
  oldNetSalary: number;
  newGrossSalary: number;
  newNetSalary: number;
  raiseReason: string
}

export interface PromotionRequestDetailsModel extends RequestDetailsModel {
  title: string;
  currentLevelId: number;
  currentLevelName: string;
  currentLevelDescription: string;
  promotionLevelId: number;
  promotionLevelName: string;
  promotionLevelDescription: string;
}

export interface HRLetterRequestDetailsModel extends RequestDetailsModel {
  language: number;
  title: string;
  fullName: string;
  toWhomItMayConcern: string;
  grossSalaryIncluded: boolean;
}

export interface ChangeManagerRequestDetailsModel extends RequestDetailsModel {
  oldManager: IssuerModel;
  newManager: IssuerModel;
  newTenroxGroup: string;
  effectiveStartDate: Date;
  newDepartmentName: string
  newDepartmentCode: string
  oldDepartmentName: string
  oldDepartmentCode: string
}

export interface VoucherRequestDetailsModel extends RequestDetailsModel {
  amount: number;
  type: number;
}

export interface ReferralRequestDetailsModel extends RequestDetailsModel {
  amount: number;
  referee: IssuerModel;
}

export interface GounaVoucherRequestDetails extends RequestDetailsModel {
  reason: string;
}

export interface TrainingRequestDetailsModel extends RequestDetailsModel {
  trainingName: string;
  courseDescription: string;
  courseLink: string;
  place: string;
  impact: string;
  expectedPrice: number;
}

export interface PeerToPeerRequestDetailsModel extends RequestDetailsModel {
  reason: string;
  message: string;
  chosenVoucher: string;
  receiptPath: string;
  entityName: string;
  amount: number;
}

export interface BalanceManagementModel extends RequestDetailsModel {
  leaveType: number;
  balanceFor: number;
  teamId: number;
  teamName: null;
  teamManagerFullName: null;
  teamManagerOrganizationEmail: null;
  cycleId: string;
  cycleName: string;
  reason: string;
  recoveredDays: number;
}
export interface OfferDetailsModel extends RequestDetailsModel {
  candidateFullName: string;
  candidateEmail: string;
  candidateHunterURL: string;
  teamId: number;
  teamName: string;
  teamManagerFullName: string;
  teamManagerOrganizationEmail: string;
  positionId: string;
  positionName: string;
  offerEmploymentType: number;
  hiringDate?: Date;
  shift: string;
  shiftName: string;
  shiftId: string;
  shiftWorkingHours: string;
  title: string;
  levelId: string;
  levelName: string;
  levelDescription: string;
  jobId: string;
  jobName: string;
  salaryLevelId: number;
  salaryLevelName: string;
  salaryLevelFrom: number;
  salaryLevelTo: number;
  grossSalary: number;
  candidateRejectionReason: string;
  id: string;
  expiryDate: Date;
  candidateRejectionNote: string;
  candidateRejectionReasons: string[];
}

/*_______________________________Allocation Leave Models__________________________________________*/
export interface AllocationModel extends RequestDetailsModel {
  cycleId: string;
  cycleName: null;
  day: Date;
  to: Date;
  entityId: number;
  reason: string;
  workAmount: number;
}

/*_______________________________ Unpaid Leave Models__________________________________________*/
export interface UnpaidModel extends RequestDetailsModel {
  days: number;
  reason: string;
}

/*_______________________________AnnualLeave Models__________________________________________*/
export interface LeaveDetailsModel extends RequestDetailsModel {
  from: Date;
  to: Date;
  requestedDays: number;
  totalBalance: number;
  remainingBalance: number;
  reason: string;
  rejectionNote: string;
  managerApprovalNote: string;
  directLeadApprovalNote: string;
  uploadedFiles?: uploadedFiles[];
  halfDayType?: number;
}

export interface DownloadLeaveFile {
  requestId: string;
  fileId: string;
  fileName: string;
}


export interface uploadedFiles {
  id: string;
  fullName: string;
}
/*_______________________________No Show Models__________________________________________*/
export interface NoShowDetailsModel extends RequestDetailsModel {
  day: string;
  submittedReason: string;
  chosenReason: string;
}

/*_______________________________Probation Models__________________________________________*/
export interface ProbationDetailsModel extends RequestDetailsModel {
  title: string;
  startDate: Date;
  endDate: Date;
  extensions?: extensions[];
  failureNote: string;
  passingNote: string;
}

interface extensions {
  createdDate: Date;
  extensionDate: Date;
  extensionNote: string;
}
/*___________________________________________________Timeline model________________________________________________*/

interface taskAssignees {
  fullName: string;
  email: string;
  type: number;
}

interface actionBy {
  fullName: string;
  email: string;
  type: number;
}

export interface TimelineDetailsModel {
  taskName: string;
  assignees: taskAssignees[];
  assignedDate: string;
  actionBy: actionBy;
  actionDate: string;
  actionTaken: string;
  availableChoices: string[];
  isTerminalState: boolean;
  actionNote: string
  auditId: string
}

/* ___________________________________________________Resignation model________________________________________________ */

export interface ResignationDetailsModel extends RequestDetailsModel {
  EmployeeTitle: string,
  reason: string;
  leaveDate: Date;
  notes: string;
  isEmployeeResourceBased: boolean;
  accountName: string;
  teamName: string;
  portfolioName: string;
  accountManagerName: string;
  rejectionNote: null;
  itNotes?: string;
  doesClientKnowTheEmployeeLeaving?: string;
  isReplacementEmployeeAvailable?: string;
  doesClientApproveReplacementPlan?: string;
  isClientSatisfed?: string;
  managerAcceptanceNote?: string;
  departmentName?: string;
  employeeBalance?: number;
  offBoardingType: string;
  employeeAllocationBalance?: number;
}

/* ___________________________________________________Recruitment model________________________________________________ */

export interface RecruitmentDetailsModel extends RequestDetailsModel {
  teamName: string,
  teamManagerFullName: string,
  teamManagerOrganizationEmail: string,
  teamPLName: string,
  teamPLOrganizationEmail: string,
  positionTitle: string,
  positionExperienceNeeded: string,
  positionLocation: string,
  positionNumOfVacancies: number,
  positionRolesAndResponsibilities: rolesAndResponsibilities,
  positionDepartmentName: string,
  positionEmploymentType: number,
  positionHiringDate: Date,
  positionPriority: number,
  englishFluency: string,
  positionLevelName: string,
  positionLevelDescription: string,
  positionJobName: string,
  isEmployeeResourceBased: true,
  customerSuccessRepName: string,
  customerSuccessRepOrganizationEmail: string,
  accountName: string,
  productName: string,
  erbTeamName: string,  //resource based
  recruitmentType: string,  //resource based
  clientRequesterName: string,
  clientRequesterEmail: string,
  clientRequesterTitle: string,
  instanceNote: string;
  roleName: string,
  shiftName: string,
  shiftWorkingHours: number,
  shiftFromHour: number,
  shiftFromMinutes: number,
  shiftToHour: number,
  shiftToMinutes: number,
  shiftWorkingDays: number[];
  requestSource: string,
  positionLink: string,
  assignedRecruiters: string[];
  pendingOffersReadableIds: OffersReadableIdsModel[];
  acceptedOffersReadableIds: OffersReadableIdsModel[];
  rejectedOffersReadableIds: OffersReadableIdsModel[];
  technicalInterviewersProfiles: TechnicalInterviewerProfile[];
  selectedSkills: { id: string; name: string }[];
  appliedOnboardingRequests: OffersReadableIdsModel[];
  pendingOnboardingRequests: OffersReadableIdsModel[];
  canceledOnboardingRequests: OffersReadableIdsModel[];
}

interface TechnicalInterviewerProfile {
  id: string;
  fullName: string;
  organizationEmail: string;
}
interface OffersReadableIdsModel {
  link: string;
  readableId: number;
}
interface rolesAndResponsibilities {
  normal: string,
  decoded: string
}

/* ___________________________________________________onBoarding model________________________________________________ */
export interface onBoardingDetailsModel extends RequestDetailsModel {
  Id: string
  readableId: number
  createdDate: Date
  lastModifiedDate: Date
  workflowTypeName: string
  requestStatus: string
  instanceNote: string
  choice: AvailableChoicesModel[]
  candidateFullName: string
  candidateEmail: string
  candidateOrganizationEmail: string
  hunterProfileURL: string
  teamManagerFullName: string
  teamManagerOrganizationEmail: string
  positionName: string
  joiningDate: Date
  newJoiningDate: Date
  accountName: string
  productName: string
  eRBTeamName: string
  roleName: string
  directLeadFullName: string
  directLeadOrganizationEmail: string
  isEmployeeResourceBased: boolean,
  erbTeamName: string
  serviceStartDate: Date,
  accountManagerName: string
  accountManagerEmail: string
  contractType: number,
  poNumber: string
  billingRate: number,
  isOriginalAcademicDegreeDelivered: boolean,
  isCopyOfQualificationsCertificateDelivered: boolean,
  isCopyOfExperienceCertificateDelivered: boolean,
  isLaborOfficeCertificateDelivered: boolean,
  isPoliceBlotterDelivered: boolean,
  isOriginalCertificateOfMilitaryServiceDelivered: boolean,
  isCopyOfInsuranceClearanceFormDelivered: boolean,
  isCopyOfIdDelivered: boolean,
  isPersonalPhotoDelivered: boolean,
  isOriginalBirthCertificateDelivered: boolean,
  isInsurancePrintOutDelivered: boolean,
  cancellationDate: Date,
  cancellationReason: string,
  cancellationNote: string,
  onboardingEmailTicketNote: string,
}

/* ___________________________________________________Expense Repayment model________________________________________________ */

export interface expenseRepaymentDetailsModel extends RequestDetailsModel {
  expenseTypeName: string
  repaymentType: string
  amount: number
  dueDate: Date
  beneficiaries: Beneficiaries[]
  isOutOfBudget: boolean
  rejectionNote: string
  instanceNote: string
  uploadedReceiptPaths: DownloadExpenseReceipt[]
}

export interface DownloadExpenseReceipt {
  requestId: string;
  file: string
  fileName: string
}
export interface Beneficiaries {
  fullName: string;
  organizationEmail: string
}

export interface CommentModel {
  createdDate: Date,
  createdBy: CreatedByModel,
  content: string
}

interface CreatedByModel {
  fullName: string,
  organizationEmail: string,
  profileImageLink: string,
  id: string
}

/* ___________________________________________________ PIP Request model________________________________________________ */

export interface PIPDetailsModel extends RequestDetailsModel {
  note: string;
}
