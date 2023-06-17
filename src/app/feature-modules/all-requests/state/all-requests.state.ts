import { SSAConfigInst } from 'src/app/config/app.config';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AllRequestsService } from '../models/all-requests.service';
import * as ALL_REQUEST_ACTIONS from './all-requests.actions';
import * as ALL_REQUESTS_MODELS from '../models/all-requests.models';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class AllRequestsStateModel {
   public allRequests: ALL_REQUESTS_MODELS.AllRequestModel[];
   public pagination: PaginationConfigModel;
   public filtration: ALL_REQUESTS_MODELS.filtrationModel;
   public sortType: number;
   public showDetails: boolean;

   constructor() {
      this.allRequests = [];
      this.pagination = {
         pageNumber: 0,
         pageSize: 10
      };
      this.filtration = {
         searchQuery: '',
         sortField: 1,
         sortType: -1,
         states: [],
         types: [],
      }
      this.showDetails = false;

   }
}

@Injectable()
@State<AllRequestsStateModel>({
   name: 'allRequests',
   defaults: new AllRequestsStateModel()
})

export class AllRequestsState {
   constructor(private _mainService: AllRequestsService) { }

   /* ________________________________________ Selectors ________________________________________*/

   @Selector() static allRequests(state: AllRequestsStateModel): ALL_REQUESTS_MODELS.AllRequestModel[] { return state.allRequests };
   @Selector() static searchQuery(state: AllRequestsStateModel): string { return state.filtration.searchQuery };
   @Selector() static pagination(state: AllRequestsStateModel): PaginationConfigModel { return { ...state.pagination } };
   @Selector() static filtration(state: AllRequestsStateModel): ALL_REQUESTS_MODELS.filtrationModel { return { ...state.filtration } }
   @Selector() static showDetails(state: AllRequestsStateModel): boolean { return state.showDetails }

   /* ________________________________________ Actions ________________________________________*/

   @Action(ALL_REQUEST_ACTIONS.GetAllRequests)
   public GetAllRequests({ patchState, getState }: StateContext<AllRequestsStateModel>) {
      const { pagination: { pageNumber, pageSize }, filtration } = getState();
      return this._mainService.getAllRequests({ pageNumber, pageSize }, filtration).pipe(
         tap(({ records: allRequests, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<ALL_REQUESTS_MODELS.AllRequestModel>) => patchState({
            allRequests,
            pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
         }))
      )
   }

   @Action(ALL_REQUEST_ACTIONS.PaginateAllRequests)
   public paginateAllRequests({ patchState, dispatch }: StateContext<AllRequestsStateModel>, { pagination }: ALL_REQUEST_ACTIONS.PaginateAllRequests) {
      patchState({ pagination })
      dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests())
   }
   @Action(ALL_REQUEST_ACTIONS.SortAllRequests)
   public SortAllRequests({ getState, patchState, dispatch }: StateContext<AllRequestsStateModel>, { sort }: ALL_REQUEST_ACTIONS.SortAllRequests) {
      patchState({
         filtration: {
            ...getState().filtration,
            ...sort
         }
      })
      dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests())
   }

   @Action(ALL_REQUEST_ACTIONS.SearchAllRequests)
   public SearchAllRequests({ patchState, getState, dispatch }: StateContext<AllRequestsStateModel>, { searchQuery }: ALL_REQUEST_ACTIONS.SearchAllRequests) {
      patchState({
         filtration: { ...getState().filtration, searchQuery: searchQuery },
         pagination: { ...getState().pagination, pageNumber: 0 }
      });
      dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests())
   }

   @Action(ALL_REQUEST_ACTIONS.FilterAllRequests)
   public FilterAllRequests({ patchState, getState, dispatch }: StateContext<AllRequestsStateModel>, { filtration }: ALL_REQUEST_ACTIONS.FilterAllRequests) {
      patchState({
         filtration: { ...getState().filtration, ...filtration },
         pagination: { ...getState().pagination, pageNumber: 0 }
      })
      dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests());
   }

   @Action(ALL_REQUEST_ACTIONS.ResetFiltration)
   public ResetFiltration({ getState, patchState, dispatch }: StateContext<AllRequestsStateModel>) {
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
         }
      })
      dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests());
   }

   @Action(ALL_REQUEST_ACTIONS.ExportAllRequests)
   public ExportAllRequests({ getState }: StateContext<AllRequestsStateModel>) {
      const filtration = getState().filtration;
      return this._mainService.exportAllRequests(filtration).pipe(tap(res => downloadFile(res.body, `All ${SSAConfigInst.REQUEST_TYPES_CONFIG[filtration.types[0]]} Requests.xlsx`, res.body.type)))
   }

   @Action(ALL_REQUEST_ACTIONS.ArchiveRequest)
   public archiveRequest({ dispatch }: StateContext<AllRequestsStateModel>, { body }: ALL_REQUEST_ACTIONS.ArchiveRequest) {
      return this._mainService.archiveRequest(body).pipe(
         tap((isArchived => isArchived ? dispatch(new ALL_REQUEST_ACTIONS.GetAllRequests()) : ''))
      )
   }

   @Action(ALL_REQUEST_ACTIONS.ToggleShowDetails)
   public ToggleShowDetails({ patchState, getState}:StateContext<AllRequestsStateModel>){
     patchState({showDetails: !getState().showDetails })
   }
}
