import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { TableColumnSortModel } from "@shared/modules/tables/model/tables.model";
import * as MY_TASKS_MODELS from '../models/my-tasks.model'

export class GetMyTasks {
    static readonly type = '[MY-TASKS] Get My Tasks'
}

export class PaginateMyTasks {
    static readonly type = '[MY_TASKS] Paginate My Tasks'
    constructor(public pagination: PaginationConfigModel) { }
}

export class FilterMyTasks {
    static readonly type = '[MY_TASKS] Filter My Tasks By Request Types'
    constructor(public filtration: MY_TASKS_MODELS.MyTasksFiltrationModel) { }
}

export class SearchMyTasks {
    static readonly type = '[My_Tasks] Search My Tasks';
    constructor(public searchQuery: string) { }
}


export class SortMyTasks {
    static readonly type = '[MY_TASKS] Sort My Tasks';
    constructor(public sort: TableColumnSortModel) { }
}

export class TakeActionOnTask {
    static readonly type = '[MY-TASKS] Take Action On Task ';
    constructor(public takeActionsParams: MY_TASKS_MODELS.ActionConfigsModel) { }
}

export class TakeInjectedAction {
    static readonly type = '[MY-TASKS] Take Injected Action ';
    constructor(public takeActionsParams: MY_TASKS_MODELS.ActionConfigsModel) { }
}
export class ResetFiltration {
    static readonly type = '[MY-TASKS] Reset Filtration';
}

export class TakeActionsOnTask {
    static readonly type = '[MY-TASKS] Take Actions On Task ';
    constructor(public takeActionsParams: MY_TASKS_MODELS.ActionConfigsModel) { }
}

export class SelectTask {
    static readonly type = '[MY-TASKS] Select Task ';
    constructor(public task: MY_TASKS_MODELS.MyTasksModel, public checked: boolean) { }
}

export class SelectAllTasks {
    static readonly type = '[MY-TASKS] Select All Tasks ';
    constructor(public checked: boolean) { }
}
export class ToggleShowDetails {
    static readonly type = '[MY-TASKS] Toggle Show Details';
}

