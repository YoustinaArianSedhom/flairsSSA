import { IssuerModel, TargetEmployeeModel } from "@shared/models/shared.model";
import { Observable } from "rxjs";
import { FormControl } from '@angular/forms';

export interface MyTasksModel {
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
    taskNotes?: MyTasksTaskNoteModel;
    availableChoices: AvailableChoicesModel[];
    submittedChoice: SubmittedChoiceModel | null;
    currentStateType?: number;
    lastModifiedBy: string;
    details: string;
    isCommentable?: boolean;
}


interface MyTasksTaskNoteModel {
    priority: number;
    note: string
}

export interface SubmittedChoiceModel {
    action: string;
    cssClass: string;
}
export interface AvailableChoicesModel {
    displayName: string;
    identifier: string;
    type: number;
    icon: string;
    note: string;
    isOpeningInjectableForm: boolean;
}
export interface MyTasksFiltrationModel {
    searchQuery?: string;
    types?: number[];
    state?: number
}

export interface ActionConfigsModel {
    requestId: string;
    choice: string;
    injectedData?: {
        [x: string]: string
    }[];
    actionTaken?:string;
    changedFieldName?:string;
}


export interface InjectableDataModel {
    name: string;
    value: string;
    type: number;
    field: string;
    required: boolean;
    requiredReload: boolean;
    choices?: ChoiceModel[] | any[];
    choicesAsync?: Observable<ChoiceModel[] | any[]>;
    allowMulticheck?: boolean;
    allowMultiFileUpload?: boolean;
    allowAutoComplete?: boolean;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    minSize_Kb?: number;
    maxSize_Kb?: number;
    requiredTrue?: boolean;
    allowedExtensions?: string[];
    allowedMimeTypes?: string[];
    isTextOnly?: boolean;
    innerDescriptions?: InjectableDataModel[];
    isTextArea?: boolean;
    disabled?: boolean;
    selectedValues?: any[];
    fieldFormControl?: FormControl;
    hintMessage:string;
    pattern:string;
    cssClass?: string;
    action?: string;
    note?: string;
    labelText?: string;
}

export interface ChoiceModel {
    id: string;
    displayName: string;
    searchToken: string;
    selected?: boolean;
    
}
