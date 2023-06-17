import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MY_REQUESTS_MODELS from '../../model/requests.models';

export class GetMyRequests {
    static readonly type = '[MY-REQUESTS] Get My Requests';
  }
  
  export class FilterMyRequests {
    static readonly type = '[My-REQUESTS] Filter My Requests';
    constructor(public MyRequestsFiltration: MY_REQUESTS_MODELS.MyRequestsFiltrationModel) {}
  }
  export class ResetFilterMyRequests {
    static readonly type = '[My-REQUESTS] Reset Filter My Requests';
  }
  export class PaginateMyRequests {
    static readonly type = '[MY-REQUESTS] Paginate My Requests';
    constructor(public pagination: PaginationConfigModel) {}
  }
  
  export class SearchMyRequests {
    static readonly type = '[MY-REQUESTS] Search My Requests';
    constructor(public searchQuery: string) {}
  }

  export class SortMyRequests {
    static readonly type = '[ALL-REQUESTS] Sort My Requests';
    constructor(public myRequestsSort: {sortField: number; sortType: number;}) {}
  }

  export class DeleteMyRequest {
    static readonly type = "[MY-Requests] Delete My Requests";
    constructor(public body: {requestId: string, choiceNote: string}) {}
  }
