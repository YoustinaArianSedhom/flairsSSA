import { Selector } from "@ngxs/store";
import * as MY_REQUESTS_MODELS from '../../requests/model/requests.models';
import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { AllLeaveState } from "./all-leave.state";
import { AllLeaveStateModel } from "./all-leave.state.model";


export class AllLeaveStateSelectors {

    /* _____________________________________________________ ALL Leave ____________________________________________________________*/
    @Selector([AllLeaveState]) static allLeave(state: AllLeaveStateModel): MY_REQUESTS_MODELS.MyRequestModel[] {
        return state.allLeave;
}


@Selector([AllLeaveState]) static allLeavePagination(
    state: AllLeaveStateModel
): PaginationConfigModel {
    return { ...state.allLeavePagination };
}


@Selector([AllLeaveState]) static allLeaveSearchQuery(state: AllLeaveStateModel): string {
    return state.allLeaveSearchQuery;
}


@Selector([AllLeaveState]) static LeaveFiltration(state: AllLeaveStateModel): MY_REQUESTS_MODELS.MyRequestsFiltrationModel {
    return { ...state.leaveFiltration };
}

}
