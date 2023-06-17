import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as MY_TEAMS_TASKS_MODEL from '@modules/my-teams-tasks/models/my-teams-tasks.model'
import * as MY_TEAMS_TASKS_CONFIG from '@modules/my-teams-tasks/models/my-teams-tasks.config'
@Injectable({
  providedIn: 'root'
})
export class MyTeamsTasksService {

  constructor(private _http: HttpService) { }

  public getMyTeamsTasks(pagination: PaginationConfigModel, filtration: MY_TEAMS_TASKS_MODEL.MyTeamsTasksFiltrationModel): Observable<PaginationModel<MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel>> {
    return this._http.post(`${MY_TEAMS_TASKS_CONFIG.MY_TEAMS_TASKS_ENDPOINTS_BASE}/GetMyTeamTasks${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<MY_TEAMS_TASKS_MODEL.MyTeamsTasksModel>>) => {
          return res.result
        }
      )
    )
  }
}
