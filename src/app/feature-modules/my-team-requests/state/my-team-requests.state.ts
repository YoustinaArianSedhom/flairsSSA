import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';
import * as MY_TEAM_REQUESTS_ACTIONS from './my-team-requests.actions'
import * as MY_TEAM_REQUESTS_CONFIG from '@modules/my-team-requests/models/my-team-requests.config';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import { MyTeamRequestsService } from '../models/my-team-requests.service';
import { downloadFile } from '@shared/helpers/download-file.helper';
export class MyTeamRequestsStateModel {
   public allMyTeamRequests: MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel[];
   public pagination: PaginationConfigModel;
   public filtration: MY_TEAM_REQUESTS_MODELS.filtrationModel;
   public sortType: number;
   constructor() {
      this.allMyTeamRequests = [];
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
@State<MyTeamRequestsStateModel>({
   name: 'myTeamRequests',
   defaults: new MyTeamRequestsStateModel()
})

export class MyTeamRequestsState {
   constructor(private _mainService: MyTeamRequestsService) { }

   /* ____________________________________ Selectors ____________________________________ */

   @Selector() static allMyTeamRequests(state: MyTeamRequestsStateModel): MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel[] { return state.allMyTeamRequests }
   @Selector() static searchQuery(state: MyTeamRequestsStateModel): string { return state.filtration.searchQuery };
   @Selector() static pagination(state: MyTeamRequestsStateModel): PaginationConfigModel { return { ...state.pagination } }
   @Selector() static filtration(state: MyTeamRequestsStateModel): MY_TEAM_REQUESTS_MODELS.filtrationModel { return { ...state.filtration } }

   @Action(MY_TEAM_REQUESTS_ACTIONS.GetMyTeamRequests)
   public GetMyTeamRequests({patchState, getState}:StateContext<MyTeamRequestsStateModel>){
      const { pagination: { pageNumber, pageSize }, filtration } = getState();
      return this._mainService.getMyTeamRequests({ pageNumber, pageSize }, filtration).pipe(
         tap(({ records: allMyTeamRequests, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel>) => {
            patchState({
               allMyTeamRequests,
               pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
            })
         })
      )
   }
   @Action(MY_TEAM_REQUESTS_ACTIONS.PaginateMyTeamRequests)
   public PaginateMyTeamRequests({ patchState, getState, dispatch }: StateContext<MyTeamRequestsStateModel>, { pagination }: MY_TEAM_REQUESTS_ACTIONS.PaginateMyTeamRequests) {
      patchState({ pagination });
      dispatch(new MY_TEAM_REQUESTS_ACTIONS.GetMyTeamRequests());
   }

   @Action(MY_TEAM_REQUESTS_ACTIONS.SearchMyTeamRequests)
   public SearchMyTeamRequests({ patchState, getState, dispatch }: StateContext<MyTeamRequestsStateModel>, { searchQuery }: MY_TEAM_REQUESTS_ACTIONS.SearchMyTeamRequests) {
      patchState({
         filtration: { ...getState().filtration, searchQuery: searchQuery },
         pagination: { ...getState().pagination, pageNumber: 0 }
      });
      dispatch(new MY_TEAM_REQUESTS_ACTIONS.GetMyTeamRequests());
   }

   @Action(MY_TEAM_REQUESTS_ACTIONS.FilterMyTeamRequests)
   public FilterMyTeamRequests({ patchState, getState, dispatch }: StateContext<MyTeamRequestsStateModel>, { filtration }: MY_TEAM_REQUESTS_ACTIONS.FilterMyTeamRequests) {
      patchState({
         filtration: { ...getState().filtration, ...filtration },
         pagination: { ...getState().pagination, pageNumber: 0 }
      })
      dispatch(new MY_TEAM_REQUESTS_ACTIONS.GetMyTeamRequests());

   }

   @Action(MY_TEAM_REQUESTS_ACTIONS.ResetFiltration)
   public ResetFiltration({getState, patchState }: StateContext<MyTeamRequestsStateModel>) {
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

   @Action(MY_TEAM_REQUESTS_ACTIONS.ExportMyTeamRequests)
   public ExportMyTeamRequests({ getState }: StateContext<MyTeamRequestsStateModel>){
      const filtration = getState().filtration;
      return this._mainService.exportMyTeamRequests(filtration).pipe(tap(res => downloadFile(res.body, `My Team's ${MY_TEAM_REQUESTS_CONFIG.REQUEST_TYPES_CONFIG[filtration.types[0]]} Requests.xlsx`, res.body.type)))
   }

}
