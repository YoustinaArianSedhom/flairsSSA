import { IssuerModel } from "@shared/models/shared.model";
import { DAYS_OF_WEEK } from "./requests.config";

export interface MyRequestModel {
  id: string;
  readableId?: number;
  createdDate: Date;
  lastModifiedDate: Date;
  workflowType: number;
  workflowTypeName: string;
  currentStateType: number;
  currentStateTypeName: string;
  requestStatus: string;
  issuer: IssuerModel;
  lastHumanActor: MyRequestLastHumanActorModel;
  currentAssignees: MyRequestCurrentAssigneeModel[];
  notes: MyRequestNoteModel[];
  targetEmployee?: { fullName: string; organizationEmail: string };
  issuerManger?: IssuerModel;
  instanceNote?: string;
  availableChoices: AvailableChoicesModel[];
  isEditable?:boolean;
  isCommentable?: boolean,
  details:string;

}


export interface AvailableChoicesModel {
  displayName: string;
  identifier: string;
  type: number;
  icon: string;
  submittedChoice: {
    action: string;
    cssClass: string;
  }
}

export interface MyRequestsFiltrationModel {
  searchQuery?: string;
  types?: number[];
  states?: number[];
  from?: Date;
  to?: Date
}


interface MyRequestLastHumanActorModel {
  identifier: string;
  type: number;
}

interface MyRequestCurrentAssigneeModel {
  identifier: string;
  type: number;
}

interface MyRequestNoteModel {
  sourceStateId: string;
  sourceStateName: string;
  choice: string;
  note: string;
}

/*_____________________________Auto Complete ____________________________*/

//autoComplete model
export interface EmployeesListAutocompleteModel {
  id?: string;
  fullName: string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  gender: number;
  title: string;
  department: DepartmentModel;
  createdDate: Date;
  manager: ManagersListAutocompleteModel;
  permissions: string[];
}

/*_______________________________PROMOTION REQUEST FORM MODEL________________________________*/

//entity info model

export interface EntityInfoPromotionFormModel {
  entityId: number;
  entityName: string;
}

export interface EmployeeInfoModel {
  currentLevelId: string;
  currentLevelName: string;
  currentLevelDescription: string;
  currentJobId: string;
  currentJobName: string
}

//promoted job model

export interface PromotionJobModel {
  id: number;
  function: string;
  levels: PromotionLevelModel[];
}

//promotion levels model

export interface PromotionLevelModel {
  id: string;
  name: string;
  description: string;
  orderNumber: number
}

//promotion request body model
export interface PromotionRequestBodyModel {
  entityId: number;
  entityName: string;
  targetOrganizationEmail: string;
  department: string;
  title: string;
  currentLevelId: number;
  currentLevelName: string;
  currentLevelDescription: string;
  currentJobId: string;
  currentJobName: string;
  promotionLevelId: number;
  promotionLevelName: string;
  promotionLevelDescription: string;
  promotionJobId: string;
  promotionJobName: string;
  note: string;
}

//promotion form model
export interface PromotionRequestFormModel {
  entityInfoPromotionRequest: EntityInfoPromotionFormModel;
  employeeInfo: EmployeeInfoModel;
  promotionJobList: PromotionJobModel[];
  // promotedLevels: promotionLevelModel[];
}

/*____________________________________RAISE REQUEST FORM MODEL__________________________________*/

//entity info details model
export interface EntityInfoRaiseFormModel {
  entityId: number;
  entityName: string;
  currentLevelId: string;
  currentLevelName: string;
  currentLevelDescription: string;
  currentJobId: string;
  currentJobName: string;
  salaryLevelFrom: number;
  salaryLevelTo: number;
  oldGrossSalary: number;
  oldNetSalary: number;
  monthlyPersonalExemptionAmount: number;
  monthlyBaseSocialInsurance: number;
}



export interface NewMonthlyBaseSocialInsuranceConfig {
  entityId: number;
  oldGrossSalary: number
}
export interface NewNetSalaryConfigModel {
  targetOrganizationEmail: string
  entityId: number;
  newGrossSalary: number
}

//the request body model
export interface RaiseRequestBodyModel {
  entityId: number;
  entityName: string;
  targetOrganizationEmail: string;
  department: string;
  oldGrossSalary: number;
  oldNetSalary: number;
  newGrossSalary: number;
  newNetSalary: number;
  note: string;
  currentLevelId: string;
  currentJobId: string
}
export interface RaiseRequestFormModel {
  entityInfoRaiseRequest: EntityInfoRaiseFormModel;
  newNet: number;
}

export interface DepartmentModel {
  id: string;
  name: string;
  code?: string;
}

/*______________________________________________________HR Request Form______________________________________________________________*/

export interface UserInfoModel {
  fullName: string;
  title: string
  manager?: {
    id: string;
    fullName: string;
    organizationEmail: string;
    department?: DepartmentModel
  }
}



export interface HRRequestFormModel {
  userInfo: UserInfoModel
}

export interface HRRequestFormBodyModel {
  fullName: string;
  title: string;
  language: number;
  toWhomItMayConcern: string;
  grossSalaryIncluded: boolean
}

/*______________________________________________Change Manager Request Form ________________________________________________*/
export interface ManagersListAutocompleteModel {
  organizationEmail: string;
  fullName: string;
  id: number;
  department: DepartmentModel;
}

export interface ChangeManagerRequestFormBodyModel {
  targetOrganizationEmail: string;
  newManagerOrganizationEmail: string;
  instanceNote: string;
  effectiveStartDate: string;
}
/*______________________________________________________Voucher Request Form______________________________________________________________*/
// entity for voucher request
export interface EntityInfoVoucherFormModel {
  entityId: number;
  entityName: string;
}
export interface VoucherRequestFormBodyModel {
  entityId: number;
  entityName: string;
  targetOrganizationEmail: string;
  amount: number;
  type: number;
  note: string;
}

/*________________________________________________________Referral Request Models_________________________________*/

export interface EntityInfoReferralFormModel {
  entityId: number;
  entityName: string
}

export interface ReferralRequestFormBodyModel {
  entityId: number;
  entityName: string;
  targetOrganizationEmail: string;
  refereeOrganizationEmail: string;
  amount: number
}

/*_______________________________________________________Gouna Voucher Models________________________________*/
export interface GounaVoucherRequestFormBody {
  targetOrganizationEmail: string;
  reason: string
}


/*_____________________________________________________Training Request Model ___________________________________*/
export interface TrainingRequestFormBody {
  trainingName: string;
  courseDescription: string;
  courseLink: string;
  place: string;
  expectedPrice: number;
  impact: string;
}

export interface PeerToPeerRequestFormBodyModel {
  targetOrganizationEmail: string;
  reason: string;
  message: string;
}

/*______________________________________________________ Annual Leave Requests ______________________________________________________________*/

export interface LeaveRequestFormBodyModel {
  cycleId?: string;
  from: string;
  to: string;
  reason?: string;
  uploadedFiles?: any[];
  halfDayType?: number;
}

export interface CycleByEmployeeCountryModel {
  id: string;
  name: string;
  from: Date;
  to: Date;
  isCurrent: boolean;
}
export interface CurrentLeaveBalanceModel {
  cycle: { id: string; name: string; from?: Date; to?: Date; };
  annualLeave: number;
  totalAnnualLeave: number;
  sickLeave: number;
  totalSickLeave: number;
  emergencyLeave: number;
  totalEmergencyLeave: number;
  allocationLeave: number;
  totalAllocationLeave: number;
  maternityLeave: number;
  totalMaternityLeave: number;
  militaryLeave: number;
  totalMilitaryLeave: number;
  bereavementLeave: number;
  totalBereavementLeave: number;
  weekendDays: number[];
  assignedShift: AssignedShift;
  holidays: Holiday[];
  leaveRequests: LeaveRequest[];
}

export interface LeaveRequest {
  id: string;
  name: string;
  from: Date;
  to: Date;
}

export interface Holiday {
  id: string;
  name: string;
  from: Date;
  to: Date;
}

interface AssignedShift {
  shiftId: string;
  shiftName: string;
  shiftFromHour: number;
  shiftFromMinutes: number;
  shiftToHour: number;
  shiftToMinutes: number;
  shiftWorkingHoursInMinutes: number;
  weekDays: number[];
}
/*______________________________________________________ Balance Management Models ______________________________________________________________*/

export interface BalanceManagementRequestModel {
  leaveType: number;
  balanceFor: number;
  teamId: number;
  selectedEmployeesOrganizationEmails: string[];
  cycleId: string;
  reason: string;
  recoveredDays: number;
}

export interface CycleModel {
  id: string;
  name: string;
  from: Date;
  to: Date;
  isCurrent: boolean;
}

export interface EmployeeModel {
  id: string;
  fullName: string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  gender: number;
  title: string;
  permissions: string[];
  manager: {
    id: string;
    fullName: string;
    organizationEmail: string;
  }
}

export interface TeamModel {
  id: number;
  name: string;
  mission: string;
  manager: ManagerModel
}

interface ManagerModel {
  id: number;
  name: string;
  organizationEmail: string;
  title: string;
}

/*______________________________________________________ Allocation Request Models ______________________________________________________________*/

export interface JoinedEntityFormModel {
  entityId: number;
  entityName: string;
}

export interface AllocationRequestModel {
  from: string;
  to: string;
  reason: string;
  entityId: number;
}

/*______________________________________________________ Termination Request Models ___________________________________________________*/
export interface TerminationRequestBodyModel {
  targetOrganitionalEmail: string;
  reason: string;
  leaveDate: Date;
  notes: string;
}

/*______________________________________________________ Resignation Request Models ___________________________________________________*/
export interface ResignationRequestBodyModel {
  reason: string;
  leaveDate: Date;
  notes: string;
}

/*______________________________________________________ Recruitment Request Models ___________________________________________________*/

/* Recruitment Model & related models */
export interface JobModel {
  id: string,
  function: string,
  levels: JobLevel[]
}

// JobLevel Model
export interface JobLevel {
  levelId: string;
  levelName: string;
}


// Shift Model
export interface Shift {
  id?: string;
  name?: string;
  fromHour?: number;
  fromMinutes?: number;
  toHour?: number;
  toMinutes?: number;
  isDefault?: boolean;
  weekDays?: DAYS_OF_WEEK[];
  workingHours?: number;
  workingHoursInMinutes?: number;
  fromTo?: string;
  days?: string;
}

// Skill Model
export interface AllSkills {
  id: string;
  name: string;

}

// Resource Based
export interface ResourceBasedInfo {
  isEmployeeResourceBased: boolean;
  customerSuccessRepName: string;
  customerSuccessRepOrganizationEmail: string;
  accountId: string;
  productId: string;
  erbTeamName: string;
  erbTeamId: string;
  clientRequesterName: string;
  clientRequesterEmail: string;
  clientRequesterTitle: string;
  roleId: string;
}

// Roles & Responsibilities Model
export interface RolesAndResponsibilities {
  normal: string;
  decoded: string;
}

// positions Model
export interface PositionRequest {
  title: string;
  rolesAndResponsibilities: RolesAndResponsibilities;
  skillIds: string[];
  experienceNeeded: string;
  location: string;
  numOfVacancies: number;
  departmentId: string;
  employmentType: number;
  expectedHiringDate: Date;
  priority: number;
  jobId: string;
  levelId: string;
}

// Team P&L model
export interface TeamPL {
  fullName: string;
  organizationEmail: string
}

// Team Model
export interface MyTeamDetails {
  id: number;
  name: string;
  mission: string;
}

// All Jobs With Levels Model
export interface AllJobsWithLevels {
  id: string;
  function: string;
  levels: Level[],
  orderNumber: number;

}


export interface Level {
  id: string;
  name: string;
  description: string;
}
export interface RecruitmentShiftModel {
  shiftId: string;
  shiftName: string;
  shiftFromHour: number;
  shiftFromMinutes: number;
  shiftToHour: number;
  shiftToMinutes: number;
  shiftWorkingHoursInMinutes: number;
  weekDays: number[];
}

export interface CustomerSuccess {
  fullName: string;
  organizationEmail: string;
}

export interface ProductModel {
  id: string;
  name: string;
}

export interface ResourceBasedTeam {
  id: string;
  name: string;
}


export interface ClientRequester {
  clientEmail: string;
  fullname: string;
  id: string;
  organizationEmail: string;
  profileImageLink: string;
  title: string;
}

export interface ProfileRoles {
  id: string;
  name: string;
  type: string;
  value: number;
}
/* 
 * Recruitment Details
 */
export interface RecruitmentDetailsModel {
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
  currentAssignees: CurrentAssignee[];
  availableChoices: AvailableChoice[];
  teamId: number;
  teamName: string;
  teamManagerFullName: string;
  teamManagerOrganizationEmail: string;
  teamPLName: string;
  teamPLOrganizationEmail: string;
  positionTitle: string;
  positionLink: string;
  positionExperienceNeeded: string;
  positionLocation: string;
  positionNumOfVacancies: number;
  positionRolesAndResponsibilities: PositionRolesAndResponsibilities;
  positionEmploymentType: number;
  positionHiringDate: Date;
  positionPriority: number;
  positionSkillIds: string[];
  positionSkills: string[];
  positionDepartmentId: string;
  positionDepartmentName: string;
  englishFluency: string;
  positionLevelId: string;
  positionLevelName: string;
  positionLevelDescription: string;
  positionJobId: string;
  positionJobName: string;
  isEmployeeResourceBased: boolean;
  customerSuccessRepName: string;
  customerSuccessRepOrganizationEmail: string;
  accountId: string;
  accountName: string;
  productId: string;
  productName: string;
  erbTeamName: string;
  erbTeamId: string;
  clientRequesterName: string;
  clientRequesterEmail: string;
  clientRequesterTitle: string;
  roleId: string;
  roleName: string;
  shiftId: string;
  shiftName: string;
  shiftWorkingHours: number;
  shiftFromHour: string;
  shiftFromMinutes: string;
  shiftToHour: string;
  shiftToMinutes: string;
  shiftWorkingDays: number[];
  requestSource: string;
  pendingOffersReadableIds: OffersReadableID[];
  acceptedOffersReadableIds: OffersReadableID[];
  rejectedOffersReadableIds: OffersReadableID[];
  recruitmentType: string;
  selectedSkills: skillModel[];
  technicalInterviewersProfiles: {id: string; fullName: string; organizationEmail:string}[]
}

export interface OffersReadableID {
  link: string;
  readableId: number;
}

export interface AvailableChoice {
  displayName: string;
  identifier: string;
  type: number;
  icon: string;
  submittedChoice: SubmittedChoice;
  note: string;
}

export interface SubmittedChoice {
  action: string;
  cssClass: string;
}

export interface CurrentAssignee {
  fullName: string;
  email: string;
  type: number;
}

export interface Issuer {
  fullName: string;
  organizationEmail: string;
}

export interface PositionRolesAndResponsibilities {
  normal: string;
  decoded: string;
}


// Recruitment Details ends here

export interface RecruitmentRequestFormBodyModel {
  id?:string,
  positionRequest: {
    title: string,
    rolesAndResponsibilities: PositionRolesAndResponsibilities,
    skillIds: string[],
    experienceNeeded: string,
    location: string,
    numOfVacancies: number,
    departmentId: string,
    employmentType: number,
    expectedHiringDate: string,
    priority: number,
    jobId: string,
    levelId: string
  };
  resourceBasedInfo?: {
    isEmployeeResourceBased: boolean,
    customerSuccessRepName: string,
    customerSuccessRepOrganizationEmail: string,
    accountId: string,
    productId: string,
    erbTeamName: string,
    erbTeamId: string,
    clientRequesterName: string,
    clientRequesterEmail: string,
    clientRequesterTitle: string,
    roleId: string
  };
  shiftId: string,
  instanceNote: string,
  requestSource: string,
  teamPLOrganizationEmail: string,
  TechnicalInterviewersOrganizationEmails?: string[],
  englishFluency: string,
  teamId: number;
  recruitmentType: number
}

export interface PositionRequest {
  title: string;
  rolesAndResponsibilities: RolesAndResponsibilities;
  skillIds: string[];
  experienceNeeded: string;
  location: string;
  numOfVacancies: number;
  departmentId: string;
  employmentType: number;
  expectedHiringDate: Date;
  priority: number;
  jobId: string;
  levelId: string;
}

export interface ResourceBased {
  isEmployeeResourceBased: boolean;
  customerSuccessRepName: string;
  customerSuccessRepOrganizationEmail: string;
  accountId: string;
  productId: string;
  erbTeamName: string;
  erbTeamId: string;
  clientRequesterName: string;
  clientRequesterEmail: string;
  clientRequesterTitle: string;
  roleId: string;
}

export interface skillModel {
  id: string;
  name: string;
}

export interface RecruitmentAccountModel {
  id: string,
  name: string,
  description: string,
  logoImageLink: string
}

export interface TechnicalInterviewer {
  id: string;
  fullName: string;
  personalEmail: string;
  organizationEmail: string;
  profileImageLink: string;
  gender: number;
  title: string;
  createdDate: Date;
  manager: ManagersListAutocompleteModel;
  permissions: string[];
}

// create expense repayment 
export interface ExpenseRepaymentModel {
  expenseTypeId: number;
  amount: number;
  repaymentType: number;
  dueDate: Date
  beneficiaries: string[]
  instanceNote: string
}

// monthly team budget 
export interface myCurrentMonthlyTeamBudget {
  budgetItemsDetails: BudgetItemsDetails[]
  budgetCycleDetails: BudgetCycleDetails
  cycleId: number
  entityId: number
  managerId: number
  profileId: number
  totalBudgetAmount: number
  totalBudgetRemainingAmount: number
  totalBudgetSpentAmount: number
}

export interface BudgetItemsDetails {
  budgetItemTypeId?: number;
  budgetItemTypeName?: string;
  budgetItemLimit?: number;
  budgetItemSpentAmount?: number;
  budgetItemRemainingAmount?: number;
}
export interface BudgetCycleDetails {
  name: string,
  entityId: number,
  from: Date
  to: Date
}
export interface RepaymentTypes {
  name: string,
  value: number
}

export interface PIPModel{
  targetOrganizationEmail: string;
  note?: string;
}
