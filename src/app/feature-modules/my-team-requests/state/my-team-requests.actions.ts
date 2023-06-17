import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MY_TEAM_REQUESTS_MODELS from '@modules/my-team-requests/models/my-team-requests.models';

export class GetMyTeamRequests{
   static readonly type = '[MY-TEAM-REQUESTS] Get My Team Requests';
}
export class PaginateMyTeamRequests {
   static readonly type = '[MY-TEAM-REQUESTS] Paginate My Team Requests';
   constructor(public pagination: PaginationConfigModel) { }
}
export class SearchMyTeamRequests {
   static readonly type = '[MY-TEAM-REQUESTS] Search My Team Requests';
   constructor(public searchQuery: string) { }
}
export class SortMyTeamRequests {
   static readonly type = '[MY-TEAM-REQUESTS] Sort My Team Requests';
   constructor(public sort: { sortField: number; sortType: number }) { }
}
export class FilterMyTeamRequests {
   static readonly type = '[MY-TEAM-REQUESTS] Filter My Team  Requests';
   constructor(public filtration: MY_TEAM_REQUESTS_MODELS.filtrationModel) { }
}
export class ResetFiltration{
   static readonly type = '[MY-TEAM-REQUESTS] Reset Filtration';
}

export class ExportMyTeamRequests {
   static readonly type = '[MY-TEAM-REQUESTS] Export My Team  Requests';
}
