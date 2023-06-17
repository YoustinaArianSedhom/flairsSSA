export interface UserModel {
    id: string,
    fullName: string,
    personalEmail: string,
    organizationEmail: string,
    profileImageLink: string,
    title: string,
    createdDate: Date;
    manager: {
        id: string;
        fullName: string;
        organizationEmail: string;
    }
    permissions: string[]
}


export interface userPermissionsBodyModel {
    organizationEmail: string;
    newPermissions: string[]
}

export interface UsersManagementFiltrationModel {
    searchQuery?: string;
    permissions?: string[];
}

export interface UsersRolesModel{
    id: string;
    name: string;
}

