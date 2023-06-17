import { State, Action, StateContext } from '@ngxs/store';
import { AllLeaveService } from '../model/all-leave.service';
import * as ALL_LEAVE_ACTIONS from './actions/all-leave.actions';
import * as MY_REQUESTS_MODELS from '../../requests/model/requests.models';
import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { PaginationModel } from '@core/http/apis.model';
import { AllLeaveStateModel } from './all-leave.state.model';



@Injectable()
@State<AllLeaveStateModel>({
  name: 'allLeave',
  defaults: new AllLeaveStateModel(),
})
export class AllLeaveState {
  constructor(private _mainService: AllLeaveService) { }

  /** All Leave */

  @Action(ALL_LEAVE_ACTIONS.GetAllLeave)
  public GetAllLeaves({
    patchState,
    getState,
  }: StateContext<AllLeaveStateModel>) {
    const { allLeavePagination: { pageNumber, pageSize }, leaveFiltration, allLeaveSearchQuery: searchQuery, allLeaveSort: sort } = getState()
    return this._mainService.GetAllLeave({ pageSize, pageNumber }, { ...leaveFiltration, searchQuery, ...sort }).pipe(
      tap(({ records: allLeave, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_REQUESTS_MODELS.MyRequestModel>) => patchState({
        allLeave,
        allLeavePagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }


  @Action(ALL_LEAVE_ACTIONS.PaginateAllLeave)
  public paginateAllLeave(
    { patchState, dispatch }: StateContext<AllLeaveStateModel>,
    { pagination }: ALL_LEAVE_ACTIONS.PaginateAllLeave
  ) {
    patchState({ allLeavePagination: pagination })
    dispatch(new ALL_LEAVE_ACTIONS.GetAllLeave())
  }

  @Action(ALL_LEAVE_ACTIONS.SearchAllLeave)
  public SearchAllLeave(
    { patchState, getState, dispatch }: StateContext<AllLeaveStateModel>,
    { searchQuery }: ALL_LEAVE_ACTIONS.SearchAllLeave
  ) {
    patchState({
      allLeaveSearchQuery: searchQuery,
      allLeavePagination: { ...getState().allLeavePagination, pageNumber: 0 }
    })

    dispatch(new ALL_LEAVE_ACTIONS.GetAllLeave())

  }


  @Action(ALL_LEAVE_ACTIONS.SortAllLeave)
  public sortAllLeaves({ patchState, dispatch }: StateContext<AllLeaveStateModel>, { sort }: ALL_LEAVE_ACTIONS.SortAllLeave) {
    patchState({
      allLeaveSort: sort
    })
    dispatch(new ALL_LEAVE_ACTIONS.GetAllLeave())
  }


  @Action(ALL_LEAVE_ACTIONS.FilterAllLeave)
  public filterAllLeaves(
    { patchState, getState, dispatch }: StateContext<AllLeaveStateModel>,
    { filtration }: ALL_LEAVE_ACTIONS.FilterAllLeave
  ) {
    patchState({
      leaveFiltration: { ...getState().leaveFiltration, ...filtration },
      allLeavePagination: { ...getState().allLeavePagination, pageNumber: 0 }
    })

    dispatch(new ALL_LEAVE_ACTIONS.GetAllLeave())

  }

  @Action(ALL_LEAVE_ACTIONS.ArchiveRequest)
  public archiveRequest({ dispatch }: StateContext<AllLeaveStateModel>, { body }: ALL_LEAVE_ACTIONS.ArchiveRequest) {
    return this._mainService.archiveRequest(body).pipe(
      tap((isArchived => isArchived ? dispatch(new ALL_LEAVE_ACTIONS.GetAllLeave()) : ''))
    )
  }

  @Action(ALL_LEAVE_ACTIONS.ResetFiltration)
  public ResetFiltration({ getState, patchState }: StateContext<AllLeaveStateModel>) {
    patchState({
      allLeavePagination: {
        pageNumber: 0,
        pageSize: 10
      },
      leaveFiltration: {
        ...getState().leaveFiltration,
        searchQuery: '',
        states: [],
        types: [],
        from: null,
        to: null
      },
      allLeaveSearchQuery: '',
    })
  }
}
