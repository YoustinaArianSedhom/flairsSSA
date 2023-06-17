import { SSAConfigInst } from "src/app/config/app.config";
import * as MY_REQUESTS_MODELS from '../model/requests.models';
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { TableColumnSortModel } from "@shared/modules/tables/model/tables.model";

export class RequestsStateModel {
  public myRequests: MY_REQUESTS_MODELS.MyRequestModel[];
  public myRequestSearchQuery: string;
  public myRequestsSort: TableColumnSortModel;
  public myRequestsFiltring: MY_REQUESTS_MODELS.MyRequestsFiltrationModel;
  public showDetails: boolean;


  public pagination: PaginationConfigModel;
  public searchQuery: string;
  public sort: TableColumnSortModel;

  // public allRequests: MY_REQUESTS_MODELS.MyRequestModel[];
  // public allRequestsPagination: PaginationConfigModel;
  // public allRequestSearchQuery: string;
  // public allRequestsSort: TableColumnSortModel;

  // public filtration: MY_REQUESTS_MODELS.MyRequestsFiltrationModel;

  public mySubsEmployeesListAutocomplete: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  public allMySubsEmployeesListAutocomplete: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  public managersListAutocomplete: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  public allEmployeesListAutocomplete: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[];
  public refereesListAutocomplete: MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[];


  public entityInfoVoucherRequest: MY_REQUESTS_MODELS.EntityInfoVoucherFormModel;
  public entityInfoReferralRequest: MY_REQUESTS_MODELS.EntityInfoReferralFormModel;

  public raiseRequestFormDefaults: MY_REQUESTS_MODELS.RaiseRequestFormModel;
  public raiseReasons : string[]


  public promotionFormDefaults: MY_REQUESTS_MODELS.PromotionRequestFormModel;

  public HRRequestFormDefaults: MY_REQUESTS_MODELS.HRRequestFormModel;

  public departments: MY_REQUESTS_MODELS.DepartmentModel[];

  /*__________________________ Annual Leave Requests __________________________*/
  public calculateLeaveDays: number;
  public currentLeaveBalance: MY_REQUESTS_MODELS.CurrentLeaveBalanceModel;
  public cyclesByEmployeeCountry: MY_REQUESTS_MODELS.CycleByEmployeeCountryModel[];
  public currentCycle: MY_REQUESTS_MODELS.CycleByEmployeeCountryModel;

  /*__________________________ Balance Management State Properties __________________________*/
  public allCycles: MY_REQUESTS_MODELS.CycleModel[];
  public allEmployees: MY_REQUESTS_MODELS.EmployeeModel[];
  public allTeams: MY_REQUESTS_MODELS.TeamModel[];

  /*__________________________ Allocation Request __________________________*/
  public joinedEntity: MY_REQUESTS_MODELS.JoinedEntityFormModel;

  /*___________________________________Resignation Request State Model __________________________*/
  public employeeResignationReasons: string[];

  /*___________________________________ Recruitment Requests State Model __________________________*/

  public teamPL: MY_REQUESTS_MODELS.TeamPL;
  public myTeamDetails: MY_REQUESTS_MODELS.MyTeamDetails;
  public allJobs: MY_REQUESTS_MODELS.AllJobsWithLevels[];
  public positionsLocations:string[];
  public departmentsWebAPI: MY_REQUESTS_MODELS.DepartmentModel[];
  public allSkills: MY_REQUESTS_MODELS.AllSkills[];
  public customerSuccess: MY_REQUESTS_MODELS.CustomerSuccess[];
  public allShifts: MY_REQUESTS_MODELS.Shift[];
  public profileRoles: MY_REQUESTS_MODELS.ProfileRoles[];
  public myProducts: MY_REQUESTS_MODELS.ProductModel[];
  public myTeams: MY_REQUESTS_MODELS.ResourceBasedTeam[];
  public clientRequester: MY_REQUESTS_MODELS.ClientRequester[];
  public myRecruitmentAccounts: MY_REQUESTS_MODELS.RecruitmentAccountModel[];
  public recruitmentDetails: MY_REQUESTS_MODELS.RecruitmentDetailsModel;

  /*___________________________________ Budget State Model __________________________*/

  public myCurrentMonthlyTeamBudget: MY_REQUESTS_MODELS.myCurrentMonthlyTeamBudget;

  /*___________________________________ Repayment State Model __________________________*/

  public repaymentTypes: MY_REQUESTS_MODELS.RepaymentTypes;


  constructor() {
    this.myRequests = [];

    this.myRequestSearchQuery = '';
    this.myRequestsSort = {
      sortType: SSAConfigInst.CRUD_CONFIG.sort.desc,
      sortField: 1,
    };
    this.myRequestsFiltring = {
      searchQuery: '',
      states: [],
      types: [],
    };



    this.pagination = {
      pageSize: SSAConfigInst.CRUD_CONFIG.paginationDefaults.size,
      pageNumber: SSAConfigInst.CRUD_CONFIG.paginationDefaults.startAt,
    };
    this.searchQuery = '';
    this.sort = {
      sortType: SSAConfigInst.CRUD_CONFIG.sort.desc,
      sortField: 1,
    };

    this.mySubsEmployeesListAutocomplete = [];
    this.allMySubsEmployeesListAutocomplete = [];
    this.managersListAutocomplete = [];
    this.allEmployeesListAutocomplete = [];
    this.refereesListAutocomplete = [];

    this.entityInfoVoucherRequest = null
    this.entityInfoReferralRequest = null

    this.promotionFormDefaults = null;
    this.raiseRequestFormDefaults = null;
    this.raiseReasons = []

    
    this.HRRequestFormDefaults = null;

    this.departments = [];
    /*__________________________ Annual Leave Requests __________________________*/
    this.calculateLeaveDays = 0;
    this.currentLeaveBalance = null;
    this.cyclesByEmployeeCountry = [];
    this.currentCycle = null;

    /*__________________________ Balance Management State Properties __________________________*/
    this.allCycles = null;
    this.allEmployees = null;
    this.allTeams = null;
    /*__________________________Allocation __________________________*/
    this.joinedEntity = null;


    /*______________________________Resignation Request State Initial Values______________________________*/
    this.employeeResignationReasons = [];

    /*______________________________Recruitment Requests Initial State Values______________________________*/
    this.teamPL = null;
    this.myTeamDetails = null;
    this.allJobs = [];
    this.departmentsWebAPI = [];
    this.allSkills = [];
    this.customerSuccess = [];
    this.allShifts = [];
    this.profileRoles = [];
    this.myProducts = [];
    this.myTeams = [];
    this.clientRequester = [];
    this.positionsLocations = null;
    this.myRecruitmentAccounts = null;
    this.recruitmentDetails = null;
    
    /*______________________________ Budget ______________________________*/
    
    this.myCurrentMonthlyTeamBudget = null;
    /*______________________________ Repayment ______________________________*/

    this.repaymentTypes = null;
    this.showDetails = false;
  }
}
