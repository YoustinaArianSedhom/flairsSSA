
import { IssuerModel, TargetEmployeeModel } from "@shared/models/shared.model";

export interface MyTeamLeaveRequestsModel {
   id: string;
   readableId?: number;
   createdDate: Date;
   lastModifiedDate: Date;
   workflowType: number;
   workflowTypeName: string;
   requestStatus: string;
   issuer: IssuerModel;
   targetEmployee?: TargetEmployeeModel;
   issuerManager: IssuerModel;
   instanceNote?: string;
   currentAssignees: CurrentAssignee[]
   availableChoices?: AvailableChoiceModel[];
}
export interface filtrationModel {
   searchQuery?: string,
   types?: number[],
   states?: number[],
   sortField?: number,
   sortType?: number,
   from?: Date,
   to?: Date
}


export interface AvailableChoiceModel {
   displayName: string;
   identifier: string;
   type: number;
   icon: string;
   submittedChoice?: {
      action: string;
      cssClass: string;
   }
}

interface CurrentAssignee {
   fullName: string;
   email: string;
   type: number
}


