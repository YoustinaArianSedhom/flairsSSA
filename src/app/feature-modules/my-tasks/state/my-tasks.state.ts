import { Injectable } from "@angular/core";
import { PaginationModel } from "@core/http/apis.model";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { TableColumnSortModel } from "@shared/modules/tables/model/tables.model";
import { tap, map } from 'rxjs/operators';
import { SSAConfigInst } from "src/app/config/app.config";
import * as MY_TASKS_MODELS from '../models/my-tasks.model'
import { MyTasksService } from "../models/my-tasks.service";
import * as MY_TASKS_ACTIONS from './my-tasks.actions'


export class MyTasksStateModel {
    public myTasks: MY_TASKS_MODELS.MyTasksModel[]
    public pagination: PaginationConfigModel;
    public filtration: MY_TASKS_MODELS.MyTasksFiltrationModel;
    public searchQuery: string;
    public sort: TableColumnSortModel;
    public showDetails: boolean;

    constructor() {
        this.myTasks = null;
        this.pagination = {};
        this.filtration = {
            state: 0
        };
        this.searchQuery = '';
        this.sort = {
            sortField: 1,
            sortType: SSAConfigInst.CRUD_CONFIG.sort.desc
        }
        this.showDetails = false;
    }
}
/*_______________________________DEFINING STATE__________________________________*/
@Injectable()
@State<MyTasksStateModel>({
    name: 'myTasks',
    defaults: new MyTasksStateModel()
})





export class MyTasksState {
    constructor(private _mainService: MyTasksService) { }

    /*__________________________________________SELECTORS___________________________________*/

    @Selector() static myTasks(state: MyTasksStateModel): MY_TASKS_MODELS.MyTasksModel[] {
        return state.myTasks
    }



    @Selector() static paginationConfig(state: MyTasksStateModel): PaginationConfigModel {
        return { ...state.pagination }
    }

    @Selector() static filtration(state: MyTasksStateModel): MY_TASKS_MODELS.MyTasksFiltrationModel {
        return { ...state.filtration }
    }
    @Selector() static filtrationState(state: MyTasksStateModel): number {
        return state.filtration.state
    }
    @Selector() static searchQuery(state: MyTasksStateModel): string { return state.searchQuery }
    @Selector() static showDetails(state: MyTasksStateModel): boolean { return state.showDetails }


    /*_______________________________________REDUCERS____________________________________*/

    /*_____________Retrieve my tasks table data _____________*/

    @Action(MY_TASKS_ACTIONS.GetMyTasks)
    public getMyTasks({ getState, patchState }: StateContext<MyTasksStateModel>) {
        const { pagination: { pageNumber, pageSize }, filtration, searchQuery, sort } = getState();
        return this._mainService.getMyTasks({ pageNumber, pageSize }, { ...filtration, ...sort, searchQuery }).pipe(
            tap(({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MY_TASKS_MODELS.MyTasksModel>) => {
                records.map(item=>{
                    item.checked = false
                })
                patchState({
                    myTasks: records,
                    pagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
                })
            })
        )
    }


    /*__________________Pagination______________________*/

    @Action(MY_TASKS_ACTIONS.PaginateMyTasks)
    public paginateMyTasks({ dispatch, patchState }: StateContext<MyTasksStateModel>, { pagination }: MY_TASKS_ACTIONS.PaginateMyTasks) {
        patchState({ pagination });
        dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
    }


    /*_____________________________Filtration_______________________*/

    @Action(MY_TASKS_ACTIONS.FilterMyTasks)
    public filterMyTasks({ patchState, dispatch, getState }: StateContext<MyTasksStateModel>, { filtration }: MY_TASKS_ACTIONS.FilterMyTasks) {
        const state = getState();
        patchState({
            filtration: {
                ...state.filtration,
                ...filtration
            },
            pagination: { ...getState().pagination, pageNumber: 0 } // Don't ever forget to reset the page number to zero when you filter or search
        });
        dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
    }

    /*______________________Search my tasks___________________*/

    @Action(MY_TASKS_ACTIONS.SearchMyTasks)
    public SearchMyTasks({ patchState, getState, dispatch }: StateContext<MyTasksStateModel>, { searchQuery }: MY_TASKS_ACTIONS.SearchMyTasks) {
        patchState({ searchQuery, pagination: { ...getState().pagination, pageNumber: 0 } });
        dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
    }


    @Action(MY_TASKS_ACTIONS.SortMyTasks)
    public sortMyRequests({ patchState, dispatch }: StateContext<MyTasksStateModel>, { sort }: MY_TASKS_ACTIONS.SortMyTasks) {
        patchState({
            sort
        })
        dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
    }


    /*_________________take an action______________________*/

    @Action(MY_TASKS_ACTIONS.TakeActionOnTask)
    public takeActionOnTask({ dispatch }: StateContext<MyTasksStateModel>, { takeActionsParams }: MY_TASKS_ACTIONS.TakeActionOnTask) {
        return this._mainService.takeAction(takeActionsParams).pipe(
            tap(res => {
                dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
            }
            )
        )
    }

    @Action(MY_TASKS_ACTIONS.TakeActionsOnTask)
    public takeActionsOnTask({ dispatch }: StateContext<MyTasksStateModel>, { takeActionsParams }: MY_TASKS_ACTIONS.TakeActionsOnTask) {
        return this._mainService.takeAction(takeActionsParams).pipe(
            tap(res => {
                console.log(takeActionsParams.requestId, ': operation is done')
            }
            )
        )
    }
        
    @Action(MY_TASKS_ACTIONS.TakeInjectedAction)
    public TakeInjectedAction({ dispatch }: StateContext<MyTasksStateModel>, { takeActionsParams }: MY_TASKS_ACTIONS.TakeInjectedAction) {
        return this._mainService.takeInjectedAction(takeActionsParams).pipe(
            tap(res => {
                dispatch(new MY_TASKS_ACTIONS.GetMyTasks())
            }
            )
        )
    }

    @Action(MY_TASKS_ACTIONS.ResetFiltration)
    public ResetFiltration({ patchState }: StateContext<MyTasksStateModel>) {
        patchState({
            pagination: {},
            filtration: {
                state: 0
            },
            searchQuery: '',
        });
    }

    @Action(MY_TASKS_ACTIONS.SelectTask)
    public SelectTask({ patchState, getState }: StateContext<MyTasksStateModel>, { task, checked }: MY_TASKS_ACTIONS.SelectTask) {
        patchState({
            myTasks: getState().myTasks.map(item => item.id === task.id ? { ...item, checked: checked } : item)
        })
    }

    @Action(MY_TASKS_ACTIONS.SelectAllTasks)
    public SelectAllTasks({ patchState, getState }: StateContext<MyTasksStateModel>, { checked }: MY_TASKS_ACTIONS.SelectTask) {
        if (checked) {
            const type = getState().filtration.types[0];
            patchState({
                myTasks: getState().myTasks.map(item => item.workflowType === type && (item?.currentStateType === 46 || item?.currentStateType === 15 || item?.currentStateType === 17 || item?.currentStateType === 53 || item?.currentStateType === 54 || item?.currentStateType === 59 || item?.currentStateType === 99|| item?.currentStateType === 165 || item?.currentStateType === 158 ) ? { ...item, checked: checked } : item)
            })
            // if (!task) {
            //     task = getState().myTasks.find(item => item.workflowType === 19 && (item?.currentStateType === 15 || item?.currentStateType === 17))
            // }
            // patchState({
            //     myTasks: getState().myTasks.map(item => task.currentStateType === item.currentStateType && task.workflowType === item.workflowType ? { ...item, checked: checked } : item)
            // })
        } else {
            patchState({
                myTasks: getState().myTasks.map(item => { return { ...item, checked: checked } })
            })
        }
    }

    @Action(MY_TASKS_ACTIONS.ToggleShowDetails)
    public ToggleShowDetails({ patchState, getState}:StateContext<MyTasksStateModel>){
      patchState({showDetails: !getState().showDetails })
    }

}
