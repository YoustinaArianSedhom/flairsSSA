import { MyTeamsTasksService } from './../models/my-teams-tasks.service';
import { Injectable } from '@angular/core';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_ACTION from '@modules/my-teams-tasks/state/my-teams-tasks.action'
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import { TableColumnSortModel } from '@shared/modules/tables/model/tables.model';
import { SSAConfigInst } from 'src/app/config/app.config';

export class MyTeamsTasksStateModel {
    public myTeamsTasks: MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel[]
    public pagination: PaginationConfigModel;
    public filtration: MY_TEAMS_TASKS_MODEL.MyTeamsTasksFiltrationModel;
    public searchQuery: string;
    public sort: TableColumnSortModel;
    public showDetails: boolean;

    constructor() {
        this.myTeamsTasks = null;
        this.pagination = {
            pageSize: 10,
            pageNumber: 0
        };
        this.sort = {
            sortField: 1,
            sortType: SSAConfigInst.CRUD_CONFIG.sort.desc
        }
        this.filtration = {
            state: 0
        };
        this.searchQuery = null;
        this.showDetails = false;
    }
}

@Injectable()
@State<MyTeamsTasksStateModel>({
    name: 'myTeamsTasks',
    defaults: new MyTeamsTasksStateModel()
})

export class MyTeamsTasksState {

    constructor(private _mainService: MyTeamsTasksService) { }

    @Selector() static myTeamsTasks(state: MyTeamsTasksStateModel): MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel[] {
        return state.myTeamsTasks
    }
    @Selector() static PaginateMyTeamsTasks(state: MyTeamsTasksStateModel): PaginationConfigModel {
        return { ...state.pagination }
    }
    @Selector() static filtration(state: MyTeamsTasksStateModel): MY_TEAMS_TASKS_MODEL.MyTeamsTasksFiltrationModel {
        return { ...state.filtration }
    }
    @Selector() static searchQuery(state: MyTeamsTasksStateModel): string { return state.searchQuery }
    @Selector() static showDetails(state: MyTeamsTasksStateModel): boolean { return state.showDetails }

    @Action(MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks)
    public getMyTeamsTasks({ getState, patchState }: StateContext<MyTeamsTasksStateModel>) {
        const { pagination: { pageNumber, pageSize }, filtration, searchQuery, sort } = getState();
        return this._mainService.getMyTeamsTasks({ pageNumber, pageSize }, { ...filtration, ...sort, searchQuery }).pipe(
            tap(({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel>) => {
                patchState({
                    myTeamsTasks: records,
                    pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
                })
            })
        )
    }

    @Action(MY_TEAMS_TASKS_ACTION.PaginateMyTeamsTasks)
    public PaginateMyTeamsTasks({ dispatch, patchState }: StateContext<MyTeamsTasksStateModel>, { pagination }: MY_TEAMS_TASKS_ACTION.PaginateMyTeamsTasks) {
        patchState({ pagination });
        dispatch(new MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks())
    }

    @Action(MY_TEAMS_TASKS_ACTION.FilterMyTeamsTasks)
    public FilterMyTeamsTasks({ patchState, dispatch, getState }: StateContext<MyTeamsTasksStateModel>, { filtration }: MY_TEAMS_TASKS_ACTION.FilterMyTeamsTasks) {
        patchState({
            filtration: {
                ...getState().filtration,
                ...filtration
            },
            pagination: { ...getState().pagination, pageNumber: 0 }
        });
        dispatch(new MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks())
    }

    @Action(MY_TEAMS_TASKS_ACTION.SortMyTeamsTasks)
    public sortMyRequests({ patchState, dispatch }: StateContext<MyTeamsTasksStateModel>, { sort }: MY_TEAMS_TASKS_ACTION.SortMyTeamsTasks) {
        patchState({
            sort
        })
        dispatch(new MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks())
    }

    @Action(MY_TEAMS_TASKS_ACTION.SearchMyTeamsTasks)
    public SearchMyTeamsTasks({ patchState, getState, dispatch }: StateContext<MyTeamsTasksStateModel>, { searchQuery }: MY_TEAMS_TASKS_ACTION.SearchMyTeamsTasks) {
        patchState({ searchQuery, pagination: { ...getState().pagination, pageNumber: 0 } });
        dispatch(new MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks())
    }

    @Action(MY_TEAMS_TASKS_ACTION.ResetFiltration)
    public ResetFiltration({ patchState, getState, dispatch }: StateContext<MyTeamsTasksStateModel>) {
        patchState({
            pagination: {
                ...getState().pagination,
                pageNumber: 0
            },
            filtration: {
                state: 0,
                types: null
            },
            searchQuery: '',
        });
        dispatch(new MY_TEAMS_TASKS_ACTION.GetMyTeamsTasks())
    }

    @Action(MY_TEAMS_TASKS_ACTION.ToggleShowDetails)
   public ToggleShowDetails({ patchState, getState}:StateContext<MyTeamsTasksStateModel>){
     patchState({showDetails: !getState().showDetails})
   }
}