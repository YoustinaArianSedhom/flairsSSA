import * as MY_REQUESTS_MODELS from '../../../requests/model/requests.models';
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";


export class GetAllLeave {
  static readonly type = '[ALL-LEAVE] Get ALL Leave';
}
export class PaginateAllLeave {
  static readonly type = '[ALL-LEAVE] Paginate ALL Leave';
  constructor(public pagination: PaginationConfigModel) { }
}

export class SearchAllLeave {
  static readonly type = '[ALL-LEAVE] Search ALL Leave';
  constructor(public searchQuery: string) { }
}


export class SortAllLeave {
  static readonly type = '[ALL-LEAVE] Sort All Leave';
  constructor(public sort: { sortField: number; sortType: number }) { }
}

export class FilterAllLeave {
  static readonly type = '[ALL-LEAVE] Filter All Leave';
  constructor(public filtration: MY_REQUESTS_MODELS.MyRequestsFiltrationModel) { }
}

export class ArchiveRequest {
  static readonly type = '[ALL-LEAVE] Archive Request';
  constructor(public body: { requestId: string, choiceNote: string }) { }
}
export class ResetFiltration {
  static readonly type = '[ALL-LEAVE] Reset Filtration';
}
