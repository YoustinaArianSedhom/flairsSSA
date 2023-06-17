import { SSAConfigInst } from 'src/app/config/app.config';
import { State, Action, StateContext } from '@ngxs/store';
import { MyRequestsService } from '../model/requests.service';
import * as MY_REQUESTS_ACTIONS from './requests.actions';
import * as MY_REQUESTS_MODELS from '../model/requests.models';
import * as MY_REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { PaginationModel } from '@core/http/apis.model';
import { insertItem, patch } from '@ngxs/store/operators';
import { RequestsStateModel } from './requests.state.model';
import { downloadFile } from '@shared/helpers/download-file.helper';



@Injectable()
@State<RequestsStateModel>({
  name: 'myRequests',
  defaults: new RequestsStateModel(),
})
export class RequestsState {
  constructor(private _mainService: MyRequestsService) { }


  /*____________________________________________________ MY REQUESTS REDUCERS ______________________________________________________*/
  @Action(MY_REQUESTS_ACTIONS.GetMyRequests)
  public getMyRequests({
    patchState,
    getState,
  }: StateContext<RequestsStateModel>) {
    const { pagination: { pageNumber, pageSize }, myRequestsSort: sort, myRequestsFiltring, myRequestSearchQuery: searchQuery } = getState()
    return this._mainService.getMyRequests({ pageSize, pageNumber }, { ...myRequestsFiltring, searchQuery, ...sort }).pipe(
      tap(({ records: myRequests, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_REQUESTS_MODELS.MyRequestModel>) => patchState({
        myRequests,
        pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.PaginateMyRequests)
  public paginateMyRequests(
    { patchState, dispatch }: StateContext<RequestsStateModel>,
    { pagination }: MY_REQUESTS_ACTIONS.PaginateMyRequests
  ) {
    patchState({ pagination })
    dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())
  }

  @Action(MY_REQUESTS_ACTIONS.SearchMyRequests)
  public searchMyRequests(
    { patchState, getState, dispatch }: StateContext<RequestsStateModel>,
    { searchQuery }: MY_REQUESTS_ACTIONS.SearchMyRequests
  ) {
    patchState({
      myRequestSearchQuery: searchQuery,
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())

  }

  @Action(MY_REQUESTS_ACTIONS.FilterMyRequests)
  public filterMyRequests(
    { patchState, dispatch, getState }: StateContext<RequestsStateModel>,
    { MyRequestsFiltration }: MY_REQUESTS_ACTIONS.FilterMyRequests
  ) {
    patchState({
      myRequestsFiltring: { ...getState().myRequestsFiltring, ...MyRequestsFiltration },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())


  }
  @Action(MY_REQUESTS_ACTIONS.ResetFilterMyRequests)
  public ResetFilterMyRequests(
    { patchState, getState, dispatch }: StateContext<RequestsStateModel>
  ) {
    patchState({
      myRequestsFiltring: { ...getState().myRequestsFiltring, types: null, states: [] }, myRequestSearchQuery: '',
      pagination: { ...getState().pagination, pageNumber: 0 }
    });
    dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())
  }
  @Action(MY_REQUESTS_ACTIONS.SortMyRequests)
  public sortMyRequests({ patchState, dispatch }: StateContext<RequestsStateModel>, { myRequestsSort }: MY_REQUESTS_ACTIONS.SortMyRequests) {
    patchState({
      myRequestsSort
    })
    dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())
  }
  @Action(MY_REQUESTS_ACTIONS.ToggleShowDetails)
  public ToggleShowDetails({ patchState, getState}:StateContext<RequestsStateModel>){
    patchState({showDetails: !getState().showDetails} )
  }

  @Action(MY_REQUESTS_ACTIONS.ExportMyRequests)
  public ExportMyRequests({ getState }: StateContext<RequestsStateModel>){
    const filtration = {...getState().myRequestsFiltring, searchQuery: getState().myRequestSearchQuery};
    return this._mainService.exportMyRequests(filtration).pipe(tap(res => downloadFile(res.body, `My ${SSAConfigInst.REQUEST_TYPES_CONFIG[filtration.types[0]]} Requests.xlsx`, res.body.type)))
  }


  @Action(MY_REQUESTS_ACTIONS.DeleteMyRequest)
  public DeleteMyRequest({ dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.DeleteMyRequest) {
    return this._mainService.deleteMyRequest(body).pipe(
      tap((isDeleted => {
        if (isDeleted) {
          dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests());
        }
      }))
    )
  }


  /*_________________________________________________________Auto Complete Reducers__________________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetAllMySubsEmployeesAutoComplete)
  public GetAllMySubsEmployeesAutoComplete(
    { patchState }: StateContext<RequestsStateModel>,
    { employeeName }: MY_REQUESTS_ACTIONS.MySubsEmployeesAutoComplete
  ) {
    return this._mainService.getAllMySubs(employeeName).pipe(
      tap((res) => {
        patchState({
          allMySubsEmployeesListAutocomplete: res,
        });
      })
    );
  }
  @Action(MY_REQUESTS_ACTIONS.MySubsEmployeesAutoComplete)
  public employeeAutoComplete(
    { patchState }: StateContext<RequestsStateModel>,
    { employeeName }: MY_REQUESTS_ACTIONS.MySubsEmployeesAutoComplete
  ) {
    return this._mainService.getMySubs(employeeName).pipe(
      tap((res) => {
        patchState({
          mySubsEmployeesListAutocomplete: res,
        });
      })
    );
  }

  @Action(MY_REQUESTS_ACTIONS.ClearMySubsEmployeeAutoComplete)
  public clearAutoComplete({ patchState }: StateContext<RequestsStateModel>) {
    patchState({
      mySubsEmployeesListAutocomplete: null,
    });
  }

  /*_______________________________________________Raise Request Reducers__________________________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetEntityInfoRaiseRequest)
  getEntityInfoRaiseRequest(
    { getState, patchState }: StateContext<RequestsStateModel>,
    { employeeEmail }: MY_REQUESTS_ACTIONS.GetEntityInfoRaiseRequest
  ) {
    const state = getState();
    return this._mainService.getEntityInfoRaiseRequest(employeeEmail).pipe(
      tap((res) => {
        patchState({
          raiseRequestFormDefaults: {
            ...state.raiseRequestFormDefaults,
            entityInfoRaiseRequest: res,
          },
        });
      })
    );
  }



  @Action(MY_REQUESTS_ACTIONS.GetNewNetSalary)
  getNewNetSalary(
    { patchState, getState }: StateContext<RequestsStateModel>,
    { body }: MY_REQUESTS_ACTIONS.GetNewNetSalary
  ) {
    const state = getState();
    return this._mainService.getNewNetSalary(body).pipe(
      tap((res) => {
        patchState({
          raiseRequestFormDefaults: {
            ...state.raiseRequestFormDefaults,
            newNet: res,
          },
        });
      })
    );
  }

  @Action(MY_REQUESTS_ACTIONS.ClearEntitiesListRaiseRequest)
  public clearEntitiesListRaiseRequest({
    getState,
    patchState,
  }: StateContext<RequestsStateModel>) {
    const state = getState();
    patchState({
      raiseRequestFormDefaults: {
        ...state.raiseRequestFormDefaults,
        entityInfoRaiseRequest: {
          ...state.raiseRequestFormDefaults?.entityInfoRaiseRequest,
          entityName: null,
        },
      },
    });
  }


  @Action(MY_REQUESTS_ACTIONS.GetDepartmentsList)
  public getDepartmentsList({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getDepartmentsList().pipe(
      tap((departments: MY_REQUESTS_MODELS.DepartmentModel[]) => patchState({ departments }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetRaiseReasons)
  public GetRaiseReasons({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getRaiseReasons().pipe(
      tap((raiseReasons: string[]) => {
        patchState({
          raiseReasons
        })
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateRaiseRequest)
  public createRaiseRequest(
    { setState }: StateContext<RequestsStateModel>,
    { body }: MY_REQUESTS_ACTIONS.CreateRaiseRequest
  ) {
    return this._mainService.createRaiseRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    );
  }

  /*_________________________________________________Promotion Request Reducers________________________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetEntityInfoPromotionRequest)
  public getEntityInfoPromotionRequest(
    { getState, patchState }: StateContext<RequestsStateModel>,
    { employeeEmail }: MY_REQUESTS_ACTIONS.GetEntityInfoPromotionRequest
  ) {
    const state = getState();
    return this._mainService.getEntityInfoPromotionRequest(employeeEmail).pipe(
      tap((res) => {
        patchState({
          promotionFormDefaults: {
            ...state.promotionFormDefaults,
            entityInfoPromotionRequest: {
              entityId: res.entityId,
              entityName: res.entityName,
            }
          },
        });
      })
    );
  }

  @Action(MY_REQUESTS_ACTIONS.GetEmployeeInfoPromotionRequest)
  public getEmployeeInfoPromotionRequest(
    { getState, patchState }: StateContext<RequestsStateModel>,
    { employeeEmail }: MY_REQUESTS_ACTIONS.GetEmployeeInfoPromotionRequest
  ) {
    const state = getState();
    return this._mainService.getEmployeeInfoPromotionRequest(employeeEmail).pipe(
      tap((res) => {
        patchState({
          promotionFormDefaults: {
            ...state.promotionFormDefaults,
            employeeInfo: res,
          },
        });
      })
    );
  }

  @Action(MY_REQUESTS_ACTIONS.ClearEntitiesListPromotionRequest)
  public clearEntitiesListPromotionRequest({
    getState,
    patchState,
  }: StateContext<RequestsStateModel>) {
    const state = getState();
    patchState({
      promotionFormDefaults: {
        ...state.promotionFormDefaults,
        entityInfoPromotionRequest: {
          ...state.promotionFormDefaults?.entityInfoPromotionRequest,
          entityName: null,
        },
      },
    });
  }
  @Action(MY_REQUESTS_ACTIONS.GetPromotedJobsList)
  public getPromotionLevelList({
    getState,
    patchState,
  }: StateContext<RequestsStateModel>) {
    const state = getState();
    return this._mainService.getPromotionLevelsList().pipe(
      tap((res) => {
        patchState({
          promotionFormDefaults: {
            ...state.promotionFormDefaults,
            promotionJobList: res,
          },
        });
      })
    );
  }


  @Action(MY_REQUESTS_ACTIONS.CreatePromotionRequest)
  public createPromotionRequest(
    { setState }: StateContext<RequestsStateModel>,
    { body }: MY_REQUESTS_ACTIONS.CreatePromotionRequest
  ) {
    return this._mainService.createPromotionRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }


  /*____________________________________________________HR Request Reducers________________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetMyUserInfo)
  public getMyUserInfo({ getState, patchState }: StateContext<RequestsStateModel>) {
    const state = getState();
    return this._mainService.getMyUserInfo().pipe(
      tap((res) => {
        patchState({
          HRRequestFormDefaults: {
            ...state.HRRequestFormDefaults,
            userInfo: {
              fullName: res.fullName,
              title: res.title,
              manager: res.manager
            }
          },
        });
      })
    );
  }


  @Action(MY_REQUESTS_ACTIONS.CreateHRRequest)
  public createHRRequest(
    { setState }: StateContext<RequestsStateModel>,
    { body }: MY_REQUESTS_ACTIONS.CreateHRRequest
  ) {
    return this._mainService.createHRRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }

  /*__________________________________________________Change Manager Request Reducers_________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.ManagersAutoComplete)
  public managersAutocomplete(
    { patchState }: StateContext<RequestsStateModel>,
    { managerName }: MY_REQUESTS_ACTIONS.ManagersAutoComplete
  ) {
    return this._mainService.getAllEmployees(managerName).pipe(
      tap((res) => {
        patchState({
          managersListAutocomplete: res,
        });
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.ClearManagersAutoComplete)
  public clearManagersAutocomplete(
    { patchState }: StateContext<RequestsStateModel>
  ) {
    patchState({
      managersListAutocomplete: null
    })
  }



  @Action(MY_REQUESTS_ACTIONS.CreateChangeManagerRequest)
  public createChangeManagerRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateChangeManagerRequest) {
    return this._mainService.createChangeManagerRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }
  /*____________________________________________________Voucher Request Reducers________________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetEntityInfoVoucherRequest)
  getEntityInfoVoucherRequest(
    { getState, patchState }: StateContext<RequestsStateModel>,
    { employeeEmail }: MY_REQUESTS_ACTIONS.GetEntityInfoVoucherRequest
  ) {
    const state = getState();
    return this._mainService.getEntityInfoVoucherRequest(employeeEmail).pipe(
      tap((res) => {
        patchState({
          ...state,
          entityInfoVoucherRequest: res
        }
        );
      })
    );
  }


  @Action(MY_REQUESTS_ACTIONS.CreateVoucherRequest)
  public createVoucherRequest(
    { setState }: StateContext<RequestsStateModel>,
    { body }: MY_REQUESTS_ACTIONS.CreateVoucherRequest
  ) {
    return this._mainService.createVoucherRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    );
  }

  @Action(MY_REQUESTS_ACTIONS.ClearEntitiesListVoucherRequest)
  public clearEntitiesListVoucherRequest({
    getState,
    patchState,
  }: StateContext<RequestsStateModel>) {
    const state = getState();
    patchState({
      ...state,
      entityInfoVoucherRequest: null
    });
  }

  /*______________________________________________Referral Request Reducers____________________________________*/
  @Action(MY_REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete)
  public referrersAutocomplete({ patchState }: StateContext<RequestsStateModel>, { employeeName }: MY_REQUESTS_ACTIONS.GetAllEmployeesListAutoComplete) {
    return this._mainService.getAllEmployees(employeeName).pipe(
      tap(
        (allEmployeesListAutocomplete) => { patchState({ allEmployeesListAutocomplete }) }
      )
    )
  }


  @Action(MY_REQUESTS_ACTIONS.ClearAllEmployeesListAutocomplete)
  public clearReferrersAutocomplete({ patchState }: StateContext<RequestsStateModel>) {
    patchState({
      allEmployeesListAutocomplete: null,
    });
  }

  @Action(MY_REQUESTS_ACTIONS.GetEntityInfoReferralRequest)
  getEntityInfoReferralRequest(
    { getState, patchState }: StateContext<RequestsStateModel>,
    { employeeEmail }: MY_REQUESTS_ACTIONS.GetEntityInfoReferralRequest
  ) {
    const state = getState();
    return this._mainService.getEntityInfoReferralRequest(employeeEmail).pipe(
      tap(
        (entityInfoReferralRequest) => { patchState({ entityInfoReferralRequest }) }
      )
    );
  }

  @Action(MY_REQUESTS_ACTIONS.ClearEntitiesListReferralRequest)
  public clearEntitiesListReferralRequest({
    getState,
    patchState,
  }: StateContext<RequestsStateModel>) {
    const state = getState();
    patchState({
      entityInfoReferralRequest: {
        ...state.entityInfoReferralRequest,
        entityName: null,
      }
    })
  }



  @Action(MY_REQUESTS_ACTIONS.RefereesAutoComplete)
  public refereesAutocomplete({ patchState }: StateContext<RequestsStateModel>, { employeeName }: MY_REQUESTS_ACTIONS.RefereesAutoComplete) {
    return this._mainService.getAllBusinessPartnersEmployees(employeeName).pipe(
      tap(
        (refereesListAutocomplete) => { patchState({ refereesListAutocomplete }) }
      )
    )
  }


  @Action(MY_REQUESTS_ACTIONS.ClearRefereesAutoComplete)
  public clearRefereesAutocomplete({ patchState }: StateContext<RequestsStateModel>) {
    patchState({
      refereesListAutocomplete: null,
    });
  }


  @Action(MY_REQUESTS_ACTIONS.CreateReferralRequest)
  public CreateReferralRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateReferralRequest) {
    return this._mainService.createReferralRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }

  /*_____________________________________Gouna Voucher Reducers _______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.CreateGounaVoucherRequest)
  public createGounaVoucherRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateGounaVoucherRequest) {
    return this._mainService.createGounaVoucherRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }

  /*_____________________________________Training Request Reducers________________________________________*/

  @Action(MY_REQUESTS_ACTIONS.CreateTrainingRequest)
  public createTrainingRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateTrainingRequest) {
    return this._mainService.createTrainingRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))

  }


  /*_____________________________________________Peer To Peer Request Reducers_______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.CreatePeerToPeerRequest)
  public createPeerToPeerRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreatePeerToPeerRequest) {
    return this._mainService.createPeerToPeerRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      }))))
  }

  /*_____________________________________________Annual Leave Request Reducers_______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.GetMyLeaveBalance)
  public GetMyLeaveBalance({ patchState }: StateContext<RequestsStateModel>, { cycleId }: MY_REQUESTS_ACTIONS.GetMyLeaveBalance) {
    return this._mainService.getMyLeaveBalance(cycleId).pipe(
      tap((currentLeaveBalance) => patchState({ currentLeaveBalance }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetCyclesByEmployeeCountry)
  public GetCyclesByEmployeeCountry({ patchState }: StateContext<RequestsStateModel>){
    return this._mainService.getCyclesByEmployeeCountry().pipe(
      tap((cyclesByEmployeeCountry:MY_REQUESTS_MODELS.CycleByEmployeeCountryModel[])=> patchState({cyclesByEmployeeCountry, currentCycle: cyclesByEmployeeCountry.find(item=> item.isCurrent)}))
    )
  }


  @Action(MY_REQUESTS_ACTIONS.CalculateLeaveDays)
  public CalculateLeaveDays({ patchState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CalculateLeaveDays) {

    return this._mainService.calculateLeaveDays(body).pipe(
      tap((calculateLeaveDays) => {
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
        patchState({ calculateLeaveDays })
      })
    )
  }
  @Action(MY_REQUESTS_ACTIONS.resetLeaveDays)
  public resetLeaveDays({ patchState }: StateContext<RequestsStateModel>) {
    return patchState({
      calculateLeaveDays: 0
    })
  }
  @Action(MY_REQUESTS_ACTIONS.CreateNewAnnualLeaveRequest)
  public CreateNewAnnualLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewAnnualLeaveRequest) {
    return this._mainService.createNewAnnualLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }))
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewMaternityLeaveRequest)
  public CreateNewMaternityLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewMaternityLeaveRequest) {
    return this._mainService.CreateNewMaternityLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }))
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewSickLeaveRequest)
  public CreateNewSickLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewSickLeaveRequest) {
    return this._mainService.CreateNewSickLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }));
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewMilitaryLeaveRequest)
  public CreateNewMilitaryLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewMilitaryLeaveRequest) {
    return this._mainService.CreateNewMilitaryLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }));
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewEmergencyLeaveRequest)
  public CreateNewEmergencyLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewEmergencyLeaveRequest) {
    return this._mainService.CreateNewEmergencyLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }));
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewBereavementLeaveRequest)
  public CreateNewBereavementLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewBereavementLeaveRequest) {
    return this._mainService.CreateNewBereavementLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }));
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewHalfDayLeaveRequest)
  public CreateNewHalfDayLeaveRequest({ setState, dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewHalfDayLeaveRequest) {
    return this._mainService.CreateNewHalfDayLeaveRequest(body).pipe(
      tap((newRequest) => {
        setState(patch({
          myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
        }));
        dispatch(new MY_REQUESTS_ACTIONS.resetLeaveDays())
      })
    )
  }

  /*_____________________________________________ Balance Management Requests Reducers_______________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetAllCycles)
  public GetAllCycles({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.GetAllCycles().pipe(
      tap((allCycles: MY_REQUESTS_MODELS.CycleModel[]) => patchState({ allCycles }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetAllTeams)
  public GetAllTeams({ patchState }: StateContext<RequestsStateModel>, { searchQuery }: MY_REQUESTS_ACTIONS.GetAllTeams) {
    return this._mainService.GetAllTeams(searchQuery).pipe(
      tap((allTeams: MY_REQUESTS_MODELS.TeamModel[]) => patchState({ allTeams }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.SearchEmployees)
  public SearchEmployees({ patchState }: StateContext<RequestsStateModel>, { searchQuery, exceptCurrentProfile }: MY_REQUESTS_ACTIONS.SearchEmployees) {
    return this._mainService.SearchEmployees({ searchQuery, exceptCurrentProfile }).pipe(
      tap((allEmployees: MY_REQUESTS_MODELS.EmployeeModel[]) => patchState({ allEmployees }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewBalanceManagementRequest)
  public CreateNewBalanceManagementRequest({ dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewBalanceManagementRequest) {
    return this._mainService.CreateNewBalanceManagementRequest(body).pipe(
      tap((success) => {
        // getting my request table as the response in null.
        dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())
      })
    )
  }


  /*_____________________________________________ Allocation Request Reducers_______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.GetMyJoinedEntity)
  public GetMyJoinedEntity({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.GetMyJoinedEntitiesWebAPI().pipe(
      tap((joinedEntity: MY_REQUESTS_MODELS.JoinedEntityFormModel) => patchState({ joinedEntity }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateAllocationRequest)
  public CreateAllocationRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateAllocationRequest) {
    return this._mainService.CreateAllocationRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    )
  }

  /*_____________________________________________ Resignation Request Reducers_______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.GetEmployeeResignationReasons)
  public getEmployeeResignationReasons({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getEmployeeResignationReasons().pipe(
      tap((employeeResignationReasons: string[]) => patchState({ employeeResignationReasons }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateResignationRequest)
  public createResignationRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateResignationRequest) {
    return this._mainService.createResignationRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateTerminationRequest)
  public CreateTerminationRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateTerminationRequest) {
    return this._mainService.createTerminationRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    )
  }

  /*_____________________________________________ Recruitment Reducers_______________________________________*/
  @Action(MY_REQUESTS_ACTIONS.CreateRecruitmentRequest)
  public CreateRecruitmentRequest({ setState }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateRecruitmentRequest) {
    return this._mainService.CreateNewRecruitmentRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    )
  }

  // Team P&L
  @Action(MY_REQUESTS_ACTIONS.GetTeamPL) public GetTeamPL({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getTeamPL().pipe(
      tap((teamPL: MY_REQUESTS_MODELS.TeamPL) => {
        patchState({
          teamPL
        });
      })
    )
  }
  // Get Team Details
  @Action(MY_REQUESTS_ACTIONS.GetMyTeamDetails) public GetMyTeamDetails({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getMyTeamDetails().pipe(
      tap((myTeamDetails) => {
        patchState({
          myTeamDetails
        });
      })
    )
  }

  // Jobs & Levels
  @Action(MY_REQUESTS_ACTIONS.GetAllJobsWithLevels)
  public GetAllJobsWithLevels({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getAllJobsWithLevels().pipe(
      tap((allJobs: MY_REQUESTS_MODELS.AllJobsWithLevels[]) => patchState({ allJobs })
      )
    )
  }

  // Get DepartmentsWebAPI < list of departments >
  @Action(MY_REQUESTS_ACTIONS.GetDepartmentsWebAPI)
  public DepartmentsWebAPI({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getDepartmentsList().pipe(
      tap((departmentsWebAPI: MY_REQUESTS_MODELS.DepartmentModel[]) => patchState({ departmentsWebAPI })
      )
    )
  }

  // Get All Skills
  @Action(MY_REQUESTS_ACTIONS.GetAllSkills)
  public GetAllSkills({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getAllSkills().pipe(
      tap((allSkills: MY_REQUESTS_MODELS.AllSkills[]) => patchState({ allSkills })
      )
    )
  }

  // Get List of employees with role customer success
  @Action(MY_REQUESTS_ACTIONS.GetCustomerSuccess)
  public GetCustomerSuccess({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getCustomerSuccess().pipe(
      tap((customerSuccess: MY_REQUESTS_MODELS.CustomerSuccess[]) => patchState({ customerSuccess })
      )
    )
  }

  // Get list of shifts
  @Action(MY_REQUESTS_ACTIONS.GetAllShifts)
  public GetAllShifts({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getAllShifts().pipe(
      tap((allShifts: MY_REQUESTS_MODELS.Shift[]) => patchState({ allShifts })
      )
    )
  }

  // Get list of Products
  @Action(MY_REQUESTS_ACTIONS.GetMyProducts)
  public GetMyProducts({ patchState }: StateContext<RequestsStateModel>, { accountId }: MY_REQUESTS_ACTIONS.GetMyProducts) {
    return this._mainService.getMyProducts(accountId).pipe(
      tap((myProducts: MY_REQUESTS_MODELS.ProductModel[]) => patchState({
        myProducts
      })
      )
    )
  }

  // Get list of Teams
  @Action(MY_REQUESTS_ACTIONS.GetMyTeams)
  public GetMyTeams({ patchState }: StateContext<RequestsStateModel>, { productId }: MY_REQUESTS_ACTIONS.GetMyTeams) {
    return this._mainService.getMyTeams(productId).pipe(
      tap((myTeams: MY_REQUESTS_MODELS.ResourceBasedTeam[]) => {
        patchState({
          myTeams
        })
      })
    )
  }

  // Get list of client requesters
  @Action(MY_REQUESTS_ACTIONS.GetClientRequester)
  public GetClientRequester({ patchState }: StateContext<RequestsStateModel>, { clientAccount }: MY_REQUESTS_ACTIONS.GetClientRequester) {
    return this._mainService.getClientRequester(clientAccount).pipe(
      tap((clientRequester: MY_REQUESTS_MODELS.ClientRequester[]) => patchState({ clientRequester })
      )
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetPositionLocations)
  public GetPositionLocations({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getAllPositionsLocationsWebAPI().pipe(
      tap((positionsLocations: string[]) => {
        patchState({
          positionsLocations
        })
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetMyAccounts)
  public GetMyAccounts({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getMyAccounts().pipe(
      tap((myRecruitmentAccounts: MY_REQUESTS_MODELS.RecruitmentAccountModel[]) => {
        patchState({
          myRecruitmentAccounts
        })
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.GetMoreDetailsRecruitment)
  public GetMoreDetailsRecruitment({ patchState }: StateContext<RequestsStateModel>, { requestId }: MY_REQUESTS_ACTIONS.GetMoreDetailsRecruitment) {
    return this._mainService.getMoreDetailsRecruitment(requestId).pipe(
      tap((recruitmentDetails: MY_REQUESTS_MODELS.RecruitmentDetailsModel) => patchState({ recruitmentDetails }))
    )
  }

  @Action(MY_REQUESTS_ACTIONS.UpdateRecruitmentRequest)
  public UpdateRecruitmentRequest({}: StateContext<RequestsStateModel>,{ body }: MY_REQUESTS_ACTIONS.UpdateRecruitmentRequest){
    return this._mainService.updateRecruitmentRequest(body).pipe(
      tap((res: MY_REQUESTS_MODELS.MyRequestModel)=> {})
    )
  }

  /*_____________________________________________ Repayment & Budget Request Reducers_______________________________________*/

  @Action(MY_REQUESTS_ACTIONS.GetMyCurrentMonthlyTeamBudget)
  public GetMyCurrentMonthlyTeamBudget({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getMyCurrentMonthlyTeamBudget().pipe(
      tap((myCurrentMonthlyTeamBudget: MY_REQUESTS_MODELS.myCurrentMonthlyTeamBudget) => {
        patchState({
          myCurrentMonthlyTeamBudget
        })
      })
    )
  }

  // Expense Repayment 
  @Action(MY_REQUESTS_ACTIONS.GetRepaymentTypes)
  public GetRepaymentTypes({ patchState }: StateContext<RequestsStateModel>) {
    return this._mainService.getRepaymentTypes().pipe(
      tap((repaymentTypes: MY_REQUESTS_MODELS.RepaymentTypes) => {
        patchState({
          repaymentTypes
        })
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewExpenseRepaymentRequest)
  public CreateNewExpenseRepaymentRequest({ dispatch }: StateContext<RequestsStateModel>, { body }: MY_REQUESTS_ACTIONS.CreateNewExpenseRepaymentRequest) {
    return this._mainService.CreateNewExpenseRepaymentRequest(body).pipe(
      tap((success) => {
        // getting my request table as the response in null.
        dispatch(new MY_REQUESTS_ACTIONS.GetMyRequests())
      })
    )
  }

  @Action(MY_REQUESTS_ACTIONS.CreateNewPIPRequest)
  public CreateNewPIPRequest({ setState }: StateContext<RequestsStateModel>,{ body }: MY_REQUESTS_ACTIONS.CreateNewPIPRequest){
    return this._mainService.createNewPIPRequest(body).pipe(
      tap((newRequest) => setState(patch({
        myRequests: insertItem<MY_REQUESTS_MODELS.MyRequestModel>({ ...newRequest, requestStatus: MY_REQUESTS_CONFIGS.REQUEST_STATUES_ENUM.inProgress }, 0)
      })))
    )
  }

}
