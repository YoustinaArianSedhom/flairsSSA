import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { MyTeamLeaveService } from '../models/my-team-leave.service';
import * as MY_TEAM_LEAVE_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';
import * as MY_TEAM_LEAVE_ACTIONS from './my-team-leave.actions'
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class MyTeamLeaveRequestStateModel {
   public allMyTeamLeaveRequests: MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel[];
   public pagination: PaginationConfigModel;
   public filtration: MY_TEAM_LEAVE_MODELS.filtrationModel;
   public sortType: number;
   constructor() {
      this.allMyTeamLeaveRequests = [];
      this.pagination = {
         pageNumber: 0,
         pageSize: 10
      }
      this.filtration = {
         searchQuery: '',
         sortField: 1,
         sortType: -1,
         states: [],
         types: [],
         from: null,
         to: null
      }
   }
}

@Injectable()
@State<MyTeamLeaveRequestStateModel>({
   name: 'myTeamLeaveRequests',
   defaults: new MyTeamLeaveRequestStateModel()
})

export class MyTeamLeaveState {
   constructor(private _mainService: MyTeamLeaveService) { }

   @Selector() static allMyTeamLeaveRequests(state: MyTeamLeaveRequestStateModel): MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel[] { return state.allMyTeamLeaveRequests }
   @Selector() static searchQuery(state: MyTeamLeaveRequestStateModel): string { return state.filtration.searchQuery };
   @Selector() static pagination(state: MyTeamLeaveRequestStateModel): PaginationConfigModel { return { ...state.pagination } }
   @Selector() static filtration(state: MyTeamLeaveRequestStateModel): MY_TEAM_LEAVE_MODELS.filtrationModel { return { ...state.filtration } }

   @Action(MY_TEAM_LEAVE_ACTIONS.GetMyTeamLeaveRequests)
   public GetMyTeamLeaveRequests({ patchState, getState }: StateContext<MyTeamLeaveRequestStateModel>) {
      const { pagination: { pageNumber, pageSize }, filtration } = getState();
      return this._mainService.GetMyTeamLeaveRequests({ pageNumber, pageSize }, filtration).pipe(
         tap(({ records: allMyTeamLeaveRequests, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_TEAM_LEAVE_MODELS.MyTeamLeaveRequestsModel>) => {
            patchState({
               allMyTeamLeaveRequests,
               pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
            })
         })
      )
   }

   @Action(MY_TEAM_LEAVE_ACTIONS.PaginateMyTeamLeaveRequests)
   public PaginateMyTeamLeaveRequests({ patchState, getState, dispatch }: StateContext<MyTeamLeaveRequestStateModel>, { pagination }: MY_TEAM_LEAVE_ACTIONS.PaginateMyTeamLeaveRequests) {
      patchState({ pagination });
      dispatch(new MY_TEAM_LEAVE_ACTIONS.GetMyTeamLeaveRequests());
   }

   @Action(MY_TEAM_LEAVE_ACTIONS.SearchMyTeamLeaveRequests)
   public SearchMyTeamLeaveRequests({ patchState, getState, dispatch }: StateContext<MyTeamLeaveRequestStateModel>, { searchQuery }: MY_TEAM_LEAVE_ACTIONS.SearchMyTeamLeaveRequests) {
      patchState({
         filtration: { ...getState().filtration, searchQuery: searchQuery },
         pagination: { ...getState().pagination, pageNumber: 0 }
      });
      dispatch(new MY_TEAM_LEAVE_ACTIONS.GetMyTeamLeaveRequests());
   }

   @Action(MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests)
   public FilterMyTeamLeaveRequests({ patchState, getState, dispatch }: StateContext<MyTeamLeaveRequestStateModel>, { filtration }: MY_TEAM_LEAVE_ACTIONS.FilterMyTeamLeaveRequests) {
      patchState({
         filtration: { ...getState().filtration, ...filtration },
         pagination: { ...getState().pagination, pageNumber: 0 }
      })
      dispatch(new MY_TEAM_LEAVE_ACTIONS.GetMyTeamLeaveRequests());

   }

   @Action(MY_TEAM_LEAVE_ACTIONS.ExportMyTeamLeaveRequests)
   public ExportMyTeamLeaveRequests({ getState }: StateContext<MyTeamLeaveRequestStateModel>) {
      const filtration = getState().filtration;
      return this._mainService.ExportMyTeamLeaveRequests(filtration).pipe(tap((res) => {
         downloadFile(res.body, `My Team leave requests.xlsx`, res.body.type)
      }))
   }

   @Action(MY_TEAM_LEAVE_ACTIONS.ResetFiltration)
   public ResetFiltration({getState, patchState }: StateContext<MyTeamLeaveRequestStateModel>) {
      patchState({
         pagination: {
            pageNumber: 0,
            pageSize: 10
         },
         filtration: {
            ...getState().filtration,
            searchQuery: '',
            states: [],
            types: [],
            from: null,
            to: null
         }
      });
   }

}
