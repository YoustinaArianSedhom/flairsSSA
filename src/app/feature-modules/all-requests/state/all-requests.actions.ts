import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as ALL_REQUESTS_MODELS from '@modules/all-requests/models/all-requests.models';

export class GetAllRequests {
   static readonly type = '[ALL-REQUESTS] Get All Requests';
}
export class PaginateAllRequests {
   static readonly type = '[ALL-REQUESTS] Paginate All Requests';
   constructor(public pagination: PaginationConfigModel) { }
}

export class SearchAllRequests {
   static readonly type = '[ALL-REQUESTS] Search All Requests';
   constructor(public searchQuery: string){}
}

export class SortAllRequests {
   static readonly type = '[ALL-REQUESTS] Sort All Requests';
   constructor(public sort: { sortField: number; sortType: number }) { }
}

export class FilterAllRequests {
   static readonly type = '[ALL-REQUESTS] Filter All Requests';
   constructor(public filtration: ALL_REQUESTS_MODELS.filtrationModel) { }
}

export class ResetFiltration {
   static readonly type = '[ALL-REQUESTS] Reset Filter All Requests';
}

export class ExportAllRequests{
   static readonly type = '[ALL-REQUESTS] Export All Requests';
   
}

export class ArchiveRequest {
   static readonly type = '[ALL-REQUESTS] Archive Request';
   constructor(public body: {requestId: string, choiceNote: string}) {}
 }

 export class ToggleShowDetails {
    static readonly type = '[ALL-REQUESTS] Toggle Show Details';
}
