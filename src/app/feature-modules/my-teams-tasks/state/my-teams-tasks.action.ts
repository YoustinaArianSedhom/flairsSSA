import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import { TableColumnSortModel } from "@shared/modules/tables/model/tables.model";
export class GetMyTeamsTasks {
    static readonly type = '[MY_Teams_TASKS] Get My Teams Tasks'
}
export class PaginateMyTeamsTasks {
    static readonly type = '[MY_Teams_TASKS] Paginate My Teams Tasks'
    constructor(public pagination: PaginationConfigModel) { }
}
export class FilterMyTeamsTasks {
    static readonly type = '[MY_Teams_TASKS] Filter My Teams Tasks'
    constructor(public filtration: MY_TEAMS_TASKS_MODEL.MyTeamsTasksFiltrationModel) { }
}
export class SortMyTeamsTasks {
    static readonly type = '[MY_Teams_TASKS] Sort My Teams Tasks';
    constructor(public sort: TableColumnSortModel) { }
}
export class SearchMyTeamsTasks {
    static readonly type = '[My_Teams_Tasks] Search My Teams Tasks';
    constructor(public searchQuery: string) { }
}
export class ResetFiltration {
    static readonly type = '[MY_Teams_TASKS] Reset Filtration';
}
export class ToggleShowDetails {
    static readonly type = '[MY_Teams_TASKS] Toggle Show Details';
}