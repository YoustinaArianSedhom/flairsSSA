import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { REQUEST_ENDPOINTS_BASE } from './all-requests.config';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import * as ALL_REQUESTS_MODELS from './all-requests.models'
@Injectable()
export class AllRequestsService {

  constructor(private _http: HttpService) { }

  // Get All requests API
  public getAllRequests(pagination: PaginationConfigModel, filtration: ALL_REQUESTS_MODELS.filtrationModel): Observable<PaginationModel<ALL_REQUESTS_MODELS.AllRequestModel>> {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/GetAllRequests${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<ALL_REQUESTS_MODELS.AllRequestModel>>) => res.result
      )
    )
  }

  // Export All requests
  public exportAllRequests(filtration: ALL_REQUESTS_MODELS.filtrationModel) {
    return this._http.post(`${REQUEST_ENDPOINTS_BASE}/ExportAllRequests`, filtration, { observe: 'response', responseType: 'blob' })
  }

  // Archive Request API

  public archiveRequest(body: { requestId: string, choiceNote: string }): Observable<boolean> {
    return this._http
      .post(
        `${REQUEST_ENDPOINTS_BASE}/ArchiveRequest`,
        body
      )
      .pipe(map((res: ApiResponse<boolean>) => res.result));
  }
}
