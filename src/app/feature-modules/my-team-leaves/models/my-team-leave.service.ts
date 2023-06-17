import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { REQUEST_ENDPOINTS_BASE } from './my-team-leave.config';
import { map } from 'rxjs/operators';
import * as MY_TEAM_LEAVES_MODELS from './my-team-leaves.models';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root'
})
export class MyTeamLeaveService {

  constructor(private _http: HttpService) { }
  // Get My Team Leave Requests API
  public GetMyTeamLeaveRequests(
    pagination: PaginationConfigModel,
    filtration: MY_TEAM_LEAVES_MODELS.filtrationModel
  ): Observable<PaginationModel<MY_TEAM_LEAVES_MODELS.MyTeamLeaveRequestsModel>> {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/GetMyTeamLeaveRequests${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<MY_TEAM_LEAVES_MODELS.MyTeamLeaveRequestsModel>>) => res.result
      )
    )
  }

  // Export My Team Leave Requests to API
  public ExportMyTeamLeaveRequests(filtration: MY_TEAM_LEAVES_MODELS.filtrationModel) {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/ExportMyTeamLeaveRequests`, filtration, { observe: 'response', responseType: 'blob' })
  }
}
