import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { REQUEST_ENDPOINTS_BASE } from './my-team-requests.config';
import * as MY_TEAM_REQUESTS_MODELS from './my-team-requests.models'
@Injectable({
  providedIn: 'root'
})
export class MyTeamRequestsService {

  constructor(private _http: HttpService) { }

  // Get My Team Request API
  // /api/Request/GetMyTeamRequests
  public getMyTeamRequests(pagination: PaginationConfigModel, filtration: MY_TEAM_REQUESTS_MODELS.filtrationModel): Observable<PaginationModel<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel>> {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/GetMyTeamRequests${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<MY_TEAM_REQUESTS_MODELS.MyTeamRequestsModel>>) => res.result
      )
    )
  }

  // Export My team requests 
  public exportMyTeamRequests(filtration: MY_TEAM_REQUESTS_MODELS.filtrationModel) {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/ExportMyTeamRequests`, filtration, { observe: 'response', responseType: 'blob' })
  }
}
