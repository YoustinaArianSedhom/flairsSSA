import { IssuerModel, TargetEmployeeModel } from "@shared/models/shared.model";

export interface MyTeamsTasksModel {
    checked: boolean;
    id: string;
    readableId: number;
    createdDate: Date;
    lastModifiedDate: Date;
    workflowType: number;
    workflowTypeName: string;
    issuer: IssuerModel;
    targetEmployee: TargetEmployeeModel
    taskName: string;
    taskStatus: string;
    taskNotes?: MyTeamsTasksNoteModel;
    submittedChoice: SubmittedChoiceModel | null;
    currentStateType?: number;
    lastModifiedBy: string;
    details: string;
    currentAssignees: CurrentAssigneeModel[];
}

interface MyTeamsTasksNoteModel {
    priority: number;
    note: string
}

export interface SubmittedChoiceModel {
    action: string;
    cssClass: string;
}

export interface MyTeamsTasksFiltrationModel {
    searchQuery?: string;
    types?: number[];
    state?: number
}

export interface CurrentAssigneeModel {
    fullName: string;
    email: string;
    type: number
 }

