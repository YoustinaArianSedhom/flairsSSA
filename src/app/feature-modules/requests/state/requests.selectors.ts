import { Selector } from "@ngxs/store";
import { RequestsStateModel } from "./requests.state.model";
import * as MY_REQUESTS_MODELS from '../model/requests.models';
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { RequestsState } from "./requests.state";


export class RequestsStateSelectors {
  /* _________________________________________ MY REQUESTS _________________________________________________________________________*/
  @Selector([RequestsState]) static myRequests(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.MyRequestModel[] {
    return state.myRequests;
  }



  @Selector([RequestsState]) static paginationConfig(
    state: RequestsStateModel
  ): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector([RequestsState]) static searchQuery(state: RequestsStateModel): string {
    return state.searchQuery;
  }

  @Selector([RequestsState]) static myRequestFiltration(state: RequestsStateModel): MY_REQUESTS_MODELS.MyRequestsFiltrationModel { return { ...state.myRequestsFiltring } }


  @Selector([RequestsState]) static showDetails(state: RequestsStateModel): boolean { return state.showDetails }


  /*____________________________________________________ RAISE REQUEST SELECTORS______________________________________________________*/
  @Selector([RequestsState]) static mySubsEmployeesList(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[] {
    return state.mySubsEmployeesListAutocomplete;
  }
  @Selector([RequestsState]) static allSubsEmployeesList(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[] {
    return state.allMySubsEmployeesListAutocomplete;
  }

  @Selector([RequestsState]) static entityInfoRaiseRequest(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.EntityInfoRaiseFormModel {
    return state.raiseRequestFormDefaults.entityInfoRaiseRequest;
  }

  @Selector([RequestsState]) static entityNameRaiseRequest(
    state: RequestsStateModel
  ): string {
    return state.raiseRequestFormDefaults.entityInfoRaiseRequest.entityName;
  }


  @Selector([RequestsState]) static newNetSalary(
    state: RequestsStateModel
  ): number {
    return state.raiseRequestFormDefaults.newNet;
  }

  @Selector([RequestsState]) static departmentsList(state: RequestsStateModel): MY_REQUESTS_MODELS.DepartmentModel[] {
    return state.departments;
  }

  @Selector([RequestsState]) static raiseReasons(state: RequestsStateModel): string[] { return state.raiseReasons }


  /*_______________________________________________ PROMOTION REQUEST SELECTORS  ____________________________________________________*/

  @Selector([RequestsState]) static entityInfoPromotionRequest(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.EntityInfoPromotionFormModel {
    return state.promotionFormDefaults.entityInfoPromotionRequest;
  }

  @Selector([RequestsState]) static employeeInfoPromotionRequest(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.EmployeeInfoModel {
    return state.promotionFormDefaults.employeeInfo;
  }

  @Selector([RequestsState]) static entityNamePromotionRequest(
    state: RequestsStateModel
  ): string {
    return state.promotionFormDefaults.entityInfoPromotionRequest.entityName;
  }

  @Selector([RequestsState]) static promotionJobsList(
    state: RequestsStateModel
  ): MY_REQUESTS_MODELS.PromotionJobModel[] {
    return state.promotionFormDefaults.promotionJobList;
  }

  /*_____________________________________________________HR Request Selectors______________________________________________*/

  @Selector([RequestsState]) static userInfo(state: RequestsStateModel): MY_REQUESTS_MODELS.UserInfoModel {
    return state.HRRequestFormDefaults.userInfo
  }

    /*______________________________________________Change Manager Requests Selectors__________________________________________*/
    @Selector([RequestsState]) static managersList(state: RequestsStateModel): MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[] {
        return state.managersListAutocomplete
    }

  /*_____________________________________________________Voucher Request Selectors______________________________________________*/
  @Selector([RequestsState]) static entityInfoVoucherRequest(state: RequestsStateModel): MY_REQUESTS_MODELS.EntityInfoVoucherFormModel {
    return state.entityInfoVoucherRequest
  }
  /*____________________________________________Referral Request Selectors_________________________________________*/
  @Selector([RequestsState]) static allEmployeesList(state: RequestsStateModel): MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[] {
    return state.allEmployeesListAutocomplete
  }

  @Selector([RequestsState]) static entityInfoReferralRequest(state: RequestsStateModel): MY_REQUESTS_MODELS.EntityInfoReferralFormModel {
    return state.entityInfoReferralRequest
  }

  @Selector([RequestsState]) static entityNameReferralRequest(
    state: RequestsStateModel
  ): string {
    return state.entityInfoReferralRequest.entityName;
  }

  @Selector([RequestsState]) static refereesList(state: RequestsStateModel): MY_REQUESTS_MODELS.EmployeesListAutocompleteModel[] {
    return state.refereesListAutocomplete
  }

  /*____________________________________________ Leave Request Selectors_________________________________________*/

  @Selector([RequestsState]) static calculateLeaveDays(state: RequestsStateModel): number { return state.calculateLeaveDays }
  @Selector([RequestsState]) static currentLeaveBalance(state: RequestsStateModel): MY_REQUESTS_MODELS.CurrentLeaveBalanceModel { return state.currentLeaveBalance }
  @Selector([RequestsState]) static cyclesByEmployeeCountry(state: RequestsStateModel): MY_REQUESTS_MODELS.CycleByEmployeeCountryModel[] { return state.cyclesByEmployeeCountry }
  @Selector([RequestsState]) static currentCycle(state: RequestsStateModel): MY_REQUESTS_MODELS.CycleByEmployeeCountryModel { return state.currentCycle }


  /*____________________________________________ Balance Management Selectors_________________________________________*/

  @Selector([RequestsState]) static allCycles(state: RequestsStateModel): MY_REQUESTS_MODELS.CycleModel[] { return state.allCycles }
  @Selector([RequestsState]) static allEmployees(state: RequestsStateModel): MY_REQUESTS_MODELS.EmployeeModel[] { return state.allEmployees }
  @Selector([RequestsState]) static allTeams(state: RequestsStateModel): MY_REQUESTS_MODELS.TeamModel[] { return state.allTeams }
  /*____________________________________________ Balance Management Selectors_________________________________________*/

  @Selector([RequestsState]) static joinedEntity(state: RequestsStateModel): MY_REQUESTS_MODELS.JoinedEntityFormModel { return state.joinedEntity }


  /*_____________________________________________Resignation Request Selectors _________________________________________*/
  @Selector([RequestsState]) static employeeResignationReasons(state: RequestsStateModel): string[] { return state.employeeResignationReasons }

  /*_____________________________________________ Recruitment Request Selectors _________________________________________*/

  @Selector([RequestsState]) static TeamPL(state: RequestsStateModel): MY_REQUESTS_MODELS.TeamPL { return state.teamPL }
  @Selector([RequestsState]) static MyTeamDetails(state: RequestsStateModel): MY_REQUESTS_MODELS.MyTeamDetails { return state.myTeamDetails }
  @Selector([RequestsState]) static AllJobsWithLevels(state: RequestsStateModel): MY_REQUESTS_MODELS.AllJobsWithLevels[] { return state.allJobs }
  @Selector([RequestsState]) static DepartmentsWebAPI(state: RequestsStateModel): MY_REQUESTS_MODELS.DepartmentModel[] { return state.departmentsWebAPI }
  @Selector([RequestsState]) static AllSkills(state: RequestsStateModel): MY_REQUESTS_MODELS.AllSkills[] { return state.allSkills }
  @Selector([RequestsState]) static CustomerSuccess(state: RequestsStateModel): MY_REQUESTS_MODELS.CustomerSuccess[] { return state.customerSuccess }
  @Selector([RequestsState]) static AllShifts(state: RequestsStateModel): MY_REQUESTS_MODELS.Shift[] { return state.allShifts }
  @Selector([RequestsState]) static ProfileRoles(state: RequestsStateModel): MY_REQUESTS_MODELS.ProfileRoles[] { return state.profileRoles }
  @Selector([RequestsState]) static MyProducts(state: RequestsStateModel): MY_REQUESTS_MODELS.ProductModel[] { return state.myProducts }
  @Selector([RequestsState]) static MyTeams(state: RequestsStateModel): MY_REQUESTS_MODELS.ResourceBasedTeam[] { return state.myTeams }
  @Selector([RequestsState]) static ClientRequester(state: RequestsStateModel): MY_REQUESTS_MODELS.ClientRequester[] { return state.clientRequester }
  @Selector([RequestsState]) static PositionLocations(state: RequestsStateModel): string[] { return state.positionsLocations }
  @Selector([RequestsState]) static myRecruitmentAccounts(state: RequestsStateModel): MY_REQUESTS_MODELS.RecruitmentAccountModel[] { return state.myRecruitmentAccounts }
  @Selector([RequestsState]) static recruitmentDetails(state: RequestsStateModel): MY_REQUESTS_MODELS.RecruitmentDetailsModel { return state.recruitmentDetails }
  /*_____________________________________________ Budget Selectors _________________________________________*/
  @Selector([RequestsState]) static myCurrentMonthlyTeamBudget(state: RequestsStateModel): MY_REQUESTS_MODELS.myCurrentMonthlyTeamBudget { return state.myCurrentMonthlyTeamBudget }
  
  /*_____________________________________________ Repayment Selectors _________________________________________*/
  @Selector([RequestsState]) static repaymentTypes(state: RequestsStateModel): MY_REQUESTS_MODELS.RepaymentTypes { return state.repaymentTypes }

}
