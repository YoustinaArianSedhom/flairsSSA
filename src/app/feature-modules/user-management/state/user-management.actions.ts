import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as USER_MANAGEMENT_MODELS from '../model/user-management.models';


export class GetUsers {
  static readonly type = '[USERS-MANAGEMENT] Get Users';
}

export class PaginateUsers {
  static readonly type = '[USERS-MANAGEMENT] Paginate Users';
  constructor(public pagination: PaginationConfigModel) { }
}

export class FilterUsers {
  static readonly type = '[USERS-MANAGEMENT] Filter Users';
  constructor(public filtration: USER_MANAGEMENT_MODELS.UsersManagementFiltrationModel) { }
}

export class ResetFiltration {
  static readonly type = '[USERS-MANAGEMENT] Reset Filtration';
}

export class UpdateUserPermissions {
  static readonly type = '[USERS-MANAGEMENT] Update Users Permissions';
  constructor(public body: USER_MANAGEMENT_MODELS.userPermissionsBodyModel) { }
}



