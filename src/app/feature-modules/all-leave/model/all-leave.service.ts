import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { REQUESTS_ENDPOINTS_BASE } from './all-leave.config';
import { map } from 'rxjs/operators';
import * as REQUESTS_MODELS from '../../requests/model/requests.models';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable()
export class AllLeaveService {
  constructor(private _http: HttpService) { }

  // GET ALL LEAVE
  public GetAllLeave(
    pagination: PaginationConfigModel,
    filtration: REQUESTS_MODELS.MyRequestsFiltrationModel
  ): Observable<PaginationModel<REQUESTS_MODELS.MyRequestModel>> {
    return this._http
      .post(
        `${REQUESTS_ENDPOINTS_BASE}/GetAllLeaveRequests${buildQueryString(
          pagination
        )}`,
        filtration
      )
      .pipe(
        map(
          (res: ApiResponse<PaginationModel<REQUESTS_MODELS.MyRequestModel>>) =>
            res.result
        )
      );
  }

  public archiveRequest(body: { requestId: string, choiceNote: string }): Observable<boolean> {
    return this._http
      .post(
        `${REQUESTS_ENDPOINTS_BASE}/ArchiveRequest`,
        body
      )
      .pipe(map((res: ApiResponse<boolean>) => res.result));
  }

}
