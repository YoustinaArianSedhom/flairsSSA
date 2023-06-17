// eslint-disable-next-line @typescript-eslint/no-namespace
export interface ConfirmationDialogDataModel {
    title: string;
    content: string;
    proceedText?: string;
    cancelText?: string;
    noCancelButton?: boolean;
    class?: string;
    hint?: string
}

export interface FeedbackDialogDataModel {
    title: string;
    content: string;
    status: string;
    autoDismissTime?: number;
}

export interface InputDialogDataModel<T = any> {
    title: string;
    type?: string;
    value?: string;
    autocompleteOptions?: T[];
    autocompleteFiltrationParam?: string;
    placeholder?: string;
    proceedText?: string;
    cancelText?: string;
    isRating?: boolean;
    selectOptions?: T[];
    isSelect?: boolean;
    inputAutocomplete?: string;
}

export interface RatingDialogDataModel<T = any> {
    title: string;
    type?: string;
    value?: any;
    autocompleteOptions?: T[];
    autocompleteFiltrationParam?: string;
    rating: number;
    placeholder?: string;
    proceedText?: string;
    cancelText?: string;
    isEdit?: boolean;
}

export const getPanelClasses = (choice: string) => {
    let panelClasses = 'form-dialog--small'
    switch (choice) {
        case 'ASSIGN_RECRUITERS':
        case 'INJECT_JOIN_CANDIDATE_DATA':
        case 'ADD_COMMENT':
        case 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA':
            panelClasses = 'form-dialog--medium'
            break;
        case 'INJECT_TEAM_MANAGER_ONBOARDING_DATA':
        case 'INJECT_JOIN_CANDIDATE_TO_FLAIRSUITE_DATA':
            panelClasses = 'form-dialog--large'
            break;
        default:
            break;
    }
    return panelClasses
}
