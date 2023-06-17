import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MY_TEAM_LEAVES_MODELS from '@modules/my-team-leaves/models/my-team-leaves.models';


export class GetMyTeamLeaveRequests {
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Get My Team Leave Requests';
}

export class PaginateMyTeamLeaveRequests {
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Paginate My Team Leave Requests';
   constructor(public pagination: PaginationConfigModel) { }
}

export class SearchMyTeamLeaveRequests {
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Search My Team Leave Requests';
   constructor(public searchQuery: string) { }
}

export class SortMyTeamLeaveRequests {
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Sort My Team Leave Requests';
   constructor(public sort: { sortField: number; sortType: number }) { }
}

export class FilterMyTeamLeaveRequests {
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Filter My Team Leave Requests';
   constructor(public filtration: MY_TEAM_LEAVES_MODELS.filtrationModel) { }
}

export class ExportMyTeamLeaveRequests{
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Export My Team Leave Requests';
}

export class ResetFiltration{
   static readonly type = '[MY-TEAM-LEAVE-REQUESTS] Reset Filtration';
}
