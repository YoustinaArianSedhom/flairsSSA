import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import * as MY_TASKS_MODELS from './my-tasks.model';
import * as MY_TASKS_CONFIGS from './my-tasks.config'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root'
})
export class MyTasksService {

  constructor(
    private _http: HttpService
  ) { }

  public getMyTasks(pagination: PaginationConfigModel, filtration: MY_TASKS_MODELS.MyTasksFiltrationModel): Observable<PaginationModel<MY_TASKS_MODELS.MyTasksModel>> {
    return this._http.post(`${MY_TASKS_CONFIGS.TASKS_ENDPOINTS_BASE}/GetMyTasks${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<MY_TASKS_MODELS.MyTasksModel>>) => {
          return res.result
        }
      )
    )
  }



  public getInjectableComponents(actionConfigs: MY_TASKS_MODELS.ActionConfigsModel): Observable<MY_TASKS_MODELS.InjectableDataModel[] | null> {
    return this._http.fetch(`${MY_TASKS_CONFIGS.TASKS_ENDPOINTS_BASE}/GetInjectableComponents${buildQueryString(actionConfigs)}`).pipe(
      map(
        (res: ApiResponse<MY_TASKS_MODELS.InjectableDataModel[] | null>) => res.result
      )
    )
  }

  public takeAction(actionConfigs: MY_TASKS_MODELS.ActionConfigsModel): Observable<MY_TASKS_MODELS.MyTasksModel[]> {
    return this._http.post(`${MY_TASKS_CONFIGS.TASKS_ENDPOINTS_BASE}/TakeAction`,actionConfigs).pipe(
      map(
        (res: ApiResponse<MY_TASKS_MODELS.MyTasksModel[]>) => {
          return res.result
        }
      )
    )
  }


  public takeInjectedAction(actionConfigs: MY_TASKS_MODELS.ActionConfigsModel): Observable<MY_TASKS_MODELS.MyTasksModel[]> {
    return this._http.post(`${MY_TASKS_CONFIGS.TASKS_ENDPOINTS_BASE}/TakeInjectedAction`,actionConfigs).pipe(
      map(
        (res: ApiResponse<MY_TASKS_MODELS.MyTasksModel[]>) => {
          return res.result
        }
      )
    )
  }

  public takeSoftAction(actionConfig:MY_TASKS_MODELS.ActionConfigsModel):Observable<MY_TASKS_MODELS.InjectableDataModel[] | null> {
    return this._http.post(`${MY_TASKS_CONFIGS.TASKS_ENDPOINTS_BASE}/SoftTakeAction`,actionConfig).pipe(
      map(
        (res: ApiResponse<MY_TASKS_MODELS.InjectableDataModel[] | null>) => res.result 
        
      )
    )
  }
}




