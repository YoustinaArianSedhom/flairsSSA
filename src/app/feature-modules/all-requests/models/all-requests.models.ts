import { IssuerModel } from "@shared/models/shared.model";

export interface AllRequestModel {
   id: string;
   readableId?: number;
   createdDate: Date;
   lastModifiedDate: Date;
   workflowType: number;
   workflowTypeName: string;
   currentStateType: number;
   currentStateTypeName: string;
   requestStatus: string;
   issuer: IssuerModel;
   lastHumanActor: LastHumanActorModel;
   currentAssignees: CurrentAssigneeModel[];
   notes: NoteModel[];
   targetEmployee?: { fullName: string, organizationEmail: string },
   details: string;
}

interface LastHumanActorModel {
   identifier: string;
   type: number;
}

interface CurrentAssigneeModel{
   identifier: string;
   type: number;
}

interface NoteModel {
   sourceStateId: string;
   sourceStateName: string;
   choice: string;
   note: string;
 }

 export interface filtrationModel {
   searchQuery?: string,
   types?: number[],
   states?: number[],
   sortField?: number,
   sortType?: number,
}
