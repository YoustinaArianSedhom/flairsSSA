import { SSAConfigInst } from "src/app/config/app.config";
import * as MY_REQUESTS_MODELS from '../../requests/model/requests.models';
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { TableColumnSortModel } from "@shared/modules/tables/model/tables.model";

export class AllLeaveStateModel {

  /** All Leave */
  public allLeave: MY_REQUESTS_MODELS.MyRequestModel[];
  public allLeavePagination: PaginationConfigModel;
  public allLeaveSearchQuery: string;
  public allLeaveSort: TableColumnSortModel;
  public leaveFiltration: MY_REQUESTS_MODELS.MyRequestsFiltrationModel;

  constructor() {

    /** All Leave */
    this.allLeave = [];
    this.allLeavePagination = {
      pageSize: SSAConfigInst.CRUD_CONFIG.paginationDefaults.size,
      pageNumber: SSAConfigInst.CRUD_CONFIG.paginationDefaults.startAt,
    };
    this.allLeaveSearchQuery = '';
    this.allLeaveSort = {
      sortType: SSAConfigInst.CRUD_CONFIG.sort.desc,
      sortField: 1,
    };

    this.leaveFiltration = {
      searchQuery: '',
      states: [],
      types: [],
      from: null,
      to: null
    };

  }
}
