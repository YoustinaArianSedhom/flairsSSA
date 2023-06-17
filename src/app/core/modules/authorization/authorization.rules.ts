import { REQUESTS_MODULE_PERMISSIONS } from "@modules/requests/requests.permissions";
import { PermissionModel } from "./model/authorization.model";


export const SystemPermissions: PermissionModel[] = [
    ...REQUESTS_MODULE_PERMISSIONS
];
