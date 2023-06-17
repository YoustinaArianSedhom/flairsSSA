import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import {
  PROFILE_ENDPOINTS_BASE,
  REQUESTS_ENDPOINTS_BASE,
  AUTH_ENDPOINT
} from './requests.config';
import { map } from 'rxjs/operators';
import * as REQUESTS_MODELS from './requests.models';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable()
export class MyRequestsService {
  constructor(private _http: HttpService) { }

  /* _________________________________________________ REQUESTS-OPERATIONS ___________________________________________________*/
  public getMyRequests(
    pagination: PaginationConfigModel,
    filtration: REQUESTS_MODELS.MyRequestsFiltrationModel
  ): Observable<PaginationModel<REQUESTS_MODELS.MyRequestModel>> {
    return this._http
      .post(
        `${REQUESTS_ENDPOINTS_BASE}/GetMyRequests${buildQueryString(
          pagination
        )}`,
        filtration
      )
      .pipe(
        map(
          (res: ApiResponse<PaginationModel<REQUESTS_MODELS.MyRequestModel>>) =>
            res.result
        )
      );
  }

  public getMyAccounts(): Observable<REQUESTS_MODELS.RecruitmentAccountModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyAccounts`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.RecruitmentAccountModel[]>) => res.result
      )
    )
  }

    // Export All requests
    public exportMyRequests(filtration: REQUESTS_MODELS.MyRequestsFiltrationModel) {
      return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/ExportMyRequests`, filtration, { observe: 'response', responseType: 'blob' })
    }



  /*____________________________________________________request actions____________________________________________________________*/


  public deleteMyRequest(body: { requestId: string, choiceNote: string }): Observable<boolean> {
    return this._http
      .post(
        `${REQUESTS_ENDPOINTS_BASE}/DeleteRequest`,body)
      .pipe(map((res: ApiResponse<boolean>) => res.result));
  }

  /*_________________________________________________________Auto complete_______________________________________________________________*/
  public getMySubs(
    text: string
  ): Observable<REQUESTS_MODELS.EmployeesListAutocompleteModel[]> {
    text = text.trim().replace(/  +/g, ' ');
    return this._http
      .fetch(`${PROFILE_ENDPOINTS_BASE}/SearchMySubs?searchQuery=${text}`)
      .pipe(
        map(
          (
            res: ApiResponse<REQUESTS_MODELS.EmployeesListAutocompleteModel[]>
          ) => {
            return res.result;
          }
        )
      );
  }

  public getAllMySubs(
    searchQuery: string
  ): Observable<REQUESTS_MODELS.EmployeesListAutocompleteModel[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http
      .fetch(`${PROFILE_ENDPOINTS_BASE}/SearchMySubs${buildQueryString({noLimit:true,includeManager:true, searchQuery})}`)
      .pipe(
        map(
          (
            res: ApiResponse<REQUESTS_MODELS.EmployeesListAutocompleteModel[]>
          ) => {
            return res.result;
          }
        )
      );
  }

  /*_____________________________________________________Raise Request Form Service____________________________________________________*/
  public getEntityInfoRaiseRequest(
    email: string
  ): Observable<REQUESTS_MODELS.EntityInfoRaiseFormModel> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/GetEntityInfoWebAPI?organizationEmail=${email}`
      )
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.EntityInfoRaiseFormModel>) => {
          return res.result[0];
        })
      );
  }



  public getNewNetSalary(
    body: REQUESTS_MODELS.NewNetSalaryConfigModel
  ): Observable<number> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/CalculateNewMonthlyNetUsingCurrentConfig${buildQueryString(
          body
        )}`
      )
      .pipe(
        map((res: ApiResponse<number>) => {
          return res.result;
        })
      );
  }

  public createRaiseRequest(
    body: REQUESTS_MODELS.RaiseRequestBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewRaiseRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
      );
  }

  /*_______________________________________________________Promotion Request Service__________________________________________________*/
  public getEntityInfoPromotionRequest(
    email: string
  ): Observable<REQUESTS_MODELS.EntityInfoPromotionFormModel> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/GetEntityInfoWebAPI?organizationEmail=${email}`
      )
      .pipe(
        map(
          (res: ApiResponse<REQUESTS_MODELS.EntityInfoPromotionFormModel>) => {
            return res.result[0];
          }
        )
      );
  }

  public getEmployeeInfoPromotionRequest(
    email: string
  ): Observable<REQUESTS_MODELS.EmployeeInfoModel> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/GetEmployeeWithJobWebAPI?organizationEmail=${email}`
      )
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.EmployeeInfoModel>) => {
          return res.result;
        })
      );
  }

  public getPromotionLevelsList(): Observable<
    REQUESTS_MODELS.PromotionJobModel[]
  > {
    return this._http
      .fetch(`${REQUESTS_ENDPOINTS_BASE}/GetSalaryLevelsWebAPI`)
      .pipe(
        map((res) => {
          return res.result;
        })
      );
  }

  public getDepartmentsList(): Observable<REQUESTS_MODELS.DepartmentModel[]> {
    return this._http
      .fetch(`${REQUESTS_ENDPOINTS_BASE}/GetDepartmentsWebAPI`)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.DepartmentModel[]>) => res.result)
      );
  }

  public createPromotionRequest(
    body: REQUESTS_MODELS.PromotionRequestBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewPromotionRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
      );
  }

  /*_______________________________________________________HR Request Service _____________________________________________________*/

  public getMyUserInfo(): Observable<REQUESTS_MODELS.UserInfoModel> {
    return this._http.fetch(`${AUTH_ENDPOINT}/GetMyUserInfo`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.UserInfoModel>) => {
        return res.result;
      })
    );
  }

  public createHRRequest(
    body: REQUESTS_MODELS.HRRequestFormBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewHRLetterRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => {
          return res.result;
        })
      );
  }


  /*______________________________________________Change Manager Request Service___________________________________*/
  public getManagers(searchQuery: string): Observable<REQUESTS_MODELS.ManagersListAutocompleteModel[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http.fetch(`${PROFILE_ENDPOINTS_BASE}/SearchManagers${buildQueryString({ searchQuery, exceptCurrentProfile: true })}`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.ManagersListAutocompleteModel[]>) => res.result
      )
    )
  }

  public getTenroxGroupsList(): Observable<string[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetTenroxGroups`).pipe(
      map(
        (res: ApiResponse<string[]>) => res.result
      )
    )
  }

  public createChangeManagerRequest(body: REQUESTS_MODELS.ChangeManagerRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewChangeManagementRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*_______________________________________________________Voucher Request Service _____________________________________________________*/
  public getEntityInfoVoucherRequest(
    email: string
  ): Observable<REQUESTS_MODELS.EntityInfoVoucherFormModel> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/GetJoinedEntitiesWebAPI?organizationEmail=${email}`
      )
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.EntityInfoVoucherFormModel>) => {
          return res.result[0];
        })
      );
  }

  public createVoucherRequest(
    body: REQUESTS_MODELS.VoucherRequestFormBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewVoucherRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => {
          return res.result;
        })
      );
  }

  /*_______________________________________________________Referral Request Service _____________________________________________________*/
  public getAllEmployees(searchQuery: string): Observable<REQUESTS_MODELS.EmployeesListAutocompleteModel[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http.fetch(`${PROFILE_ENDPOINTS_BASE}/SearchEmployees${buildQueryString({ searchQuery, exceptCurrentProfile: true })}`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.EmployeesListAutocompleteModel[]>) => res.result
      )
    )
  }


  public getAllBusinessPartnersEmployees(searchQuery: string): Observable<REQUESTS_MODELS.EmployeesListAutocompleteModel[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http.fetch(`${PROFILE_ENDPOINTS_BASE}/SearchBusinessPartnerTeam${buildQueryString({ searchQuery })}`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.EmployeesListAutocompleteModel[]>) => res.result
      )
    )
  }


  public getEntityInfoReferralRequest(
    email: string
  ): Observable<REQUESTS_MODELS.EntityInfoReferralFormModel> {
    return this._http
      .fetch(
        `${REQUESTS_ENDPOINTS_BASE}/GetJoinedEntitiesWebAPI?organizationEmail=${email}`
      )
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.EntityInfoReferralFormModel>) => {
          return res.result[0];
        })
      );
  }

  public createReferralRequest(body: REQUESTS_MODELS.ReferralRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewReferralBonusRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*_________________________________________________Gouna Voucher Services______________________________________*/
  public createGounaVoucherRequest(body: REQUESTS_MODELS.GounaVoucherRequestFormBody): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewGounaRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*_____________________________________________Training Request Services_____________________________________________*/

  public createTrainingRequest(body: REQUESTS_MODELS.TrainingRequestFormBody): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewTrainingRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*_________________________________________________Peer To Peer Service_________________________________________*/

  public createPeerToPeerRequest(body: REQUESTS_MODELS.PeerToPeerRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewPeerToPeerRequest`, body).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
    )
  }

  /*_______________________________________________________Annual Leave Request Service _____________________________________________________*/
  public getMyLeaveBalance(cycleId?: string): Observable<REQUESTS_MODELS.CurrentLeaveBalanceModel> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyLeaveBalance${buildQueryString({ cycleId })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.CurrentLeaveBalanceModel>) => res.result)
    )
  }

  public getCyclesByEmployeeCountry(): Observable<REQUESTS_MODELS.CycleByEmployeeCountryModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetCyclesByEmployeeCountry`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.CycleByEmployeeCountryModel[]>) => res.result)
    )
  }

  public calculateLeaveDays(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<number> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CalculateLeaveDays`, body).pipe(
      map(
        (res: ApiResponse<number>) => res.result
      )
    )
  }

  public createNewAnnualLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewAnnualLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  public CreateNewMaternityLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewMaternityLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  public CreateNewSickLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewSickLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  public CreateNewMilitaryLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewMilitaryLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  public CreateNewEmergencyLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewEmergencyLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }
  public CreateNewBereavementLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewBereavementLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }
  public CreateNewHalfDayLeaveRequest(body: REQUESTS_MODELS.LeaveRequestFormBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewHalfDayLeaveRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }
  /*_______________________________________________________ Balance Management Requests _____________________________________________________*/

  public GetAllCycles(): Observable<REQUESTS_MODELS.CycleModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllCycles`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.CycleModel[]>) => res.result)
    )
  }

  public GetAllTeams(searchQuery: string): Observable<REQUESTS_MODELS.TeamModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllTeams${buildQueryString({ searchQuery })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.TeamModel[]>) => res.result)
    )
  }

  public SearchEmployees(body: { searchQuery: string; exceptCurrentProfile: boolean }): Observable<REQUESTS_MODELS.EmployeeModel[]> {
    return this._http.fetch(`${PROFILE_ENDPOINTS_BASE}/SearchEmployees${buildQueryString(body)}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.EmployeeModel[]>) => res.result)
    )
  }


  public CreateNewBalanceManagementRequest(body: REQUESTS_MODELS.BalanceManagementRequestModel): Observable<any> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewBalanceManagementRequest`, body).pipe(
      map(
        res => res
      )
    )
  }

  /*_______________________________________________________ Allocation Requests _____________________________________________________*/
  public GetMyJoinedEntitiesWebAPI(): Observable<REQUESTS_MODELS.JoinedEntityFormModel> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyJoinedEntitiesWebAPI`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.JoinedEntityFormModel[]>) => res.result[0])
    )
  }

  public CreateAllocationRequest(body: REQUESTS_MODELS.AllocationRequestModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateAllocationRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*____________________________________________________Resignation Request _____________________________________________*/
  public getEmployeeResignationReasons(): Observable<string[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetEmployeeResignationReasons`).pipe(
      map(
        (res: ApiResponse<string[]>) => res.result
      )
    )
  }

  public createResignationRequest(body: REQUESTS_MODELS.ResignationRequestBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewResignationRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  public createTerminationRequest(body: REQUESTS_MODELS.TerminationRequestBodyModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewTerminationRequest`, body).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result
      )
    )
  }

  /*____________________________________________________Recruitment Requests _____________________________________________*/

  // Get P&L details
  public getTeamPL(): Observable<REQUESTS_MODELS.TeamPL> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetTeamPL`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.TeamPL>) => res.result
      )
    )
  }

  // Get Team Details
  public getMyTeamDetails(): Observable<REQUESTS_MODELS.MyTeamDetails> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyTeamDetails`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.MyTeamDetails>) => res.result
      )
    )
  }

  // All Jobs With Levels
  public getAllJobsWithLevels(): Observable<REQUESTS_MODELS.AllJobsWithLevels[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllJobsWithLevels`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.AllJobsWithLevels[]>) => res.result
      )
    )
  }
  // Get Departments list
  public getDepartmentsWebAPI(): Observable<REQUESTS_MODELS.DepartmentModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetDepartmentsWebAPI`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.DepartmentModel[]>) => res.result
      )
    )
  }

  // Get all Shifts
  public getAllShifts(): Observable<REQUESTS_MODELS.Shift[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllShifts`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.Shift[]>) => res.result
      )
    )
  }

  // Get all skills
  public getAllSkills(): Observable<REQUESTS_MODELS.AllSkills[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllSkills`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.AllSkills[]>) => res.result
      )
    )
  }

  // Get Customer Success Info
  public getCustomerSuccess(): Observable<REQUESTS_MODELS.CustomerSuccess[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetCustomerSuccess`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.CustomerSuccess[]>) => res.result
      )
    )
  }

  // Get My Products with Account Id
  public getMyProducts(accountId: string): Observable<REQUESTS_MODELS.ProductModel[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyPlatforms${buildQueryString({ accountId })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.ProductModel[]>) => res.result)
    )
  }

  // Get List of Teams Info with product id
  public getMyTeams(platformId: string): Observable<REQUESTS_MODELS.ResourceBasedTeam[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyDepartments${buildQueryString({ platformId })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.ResourceBasedTeam[]>) => res.result)
    )
  }

  // Get Client Requester Info
  public getClientRequester(accountId: string): Observable<REQUESTS_MODELS.ClientRequester[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetClientRequester${buildQueryString({ accountId })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.ClientRequester[]>) => res.result)
    )
  }

  // Get list of Roles
  public getProfileRoles(): Observable<REQUESTS_MODELS.ProfileRoles> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetProfileRoles`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.ProfileRoles>) => res.result)
    )
  }
  // Get Position Locations
  public getAllPositionsLocationsWebAPI(): Observable<string[]> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetAllPositionsLocationsWebAPI`).pipe(
      map((res: ApiResponse<string[]>) => res.result)
    )
  }

  // Create Recruitment request
  public CreateNewRecruitmentRequest(
    body: REQUESTS_MODELS.RecruitmentRequestFormBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewRecruitmentRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
      );
  }
  public updateRecruitmentRequest(
    body: REQUESTS_MODELS.RecruitmentRequestFormBodyModel
  ): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/UpdateRecruitmentRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
      );
  }

  public getMoreDetailsRecruitment(requestId:string): Observable<REQUESTS_MODELS.RecruitmentDetailsModel>{
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMoreDetailsRecruitment${buildQueryString({requestId})}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.RecruitmentDetailsModel>)=> res.result)
    )
  }

  public getMyCurrentMonthlyTeamBudget(): Observable<REQUESTS_MODELS.myCurrentMonthlyTeamBudget> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetMyCurrentMonthlyTeamBudget`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.myCurrentMonthlyTeamBudget>) => res.result
      )
    )
  }

  public getRepaymentTypes(): Observable<REQUESTS_MODELS.RepaymentTypes> {
    return this._http.fetch(`${REQUESTS_ENDPOINTS_BASE}/GetRepaymentTypes`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.RepaymentTypes>) => res.result
      )
    )
  }

  public CreateNewExpenseRepaymentRequest(body: REQUESTS_MODELS.ExpenseRepaymentModel): Observable<any> {
    return this._http
      .post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewExpenseRepaymentRequest`, body)
      .pipe(
        map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
      );
  }

  public getRaiseReasons() {
    return this._http
      .fetch(`${REQUESTS_ENDPOINTS_BASE}/GetRaiseReasons`).pipe(map((res: ApiResponse<string[]>) => res.result));
  }

  // Create PIP request
  public createNewPIPRequest(body: REQUESTS_MODELS.PIPModel): Observable<REQUESTS_MODELS.MyRequestModel> {
    return this._http.post(`${REQUESTS_ENDPOINTS_BASE}/CreateNewPIPRequest`, body)
    .pipe(
      map((res: ApiResponse<REQUESTS_MODELS.MyRequestModel>) => res.result)
    );
  }

}
