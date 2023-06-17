import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { PROFILE_ENDPOINTS_BASE } from '@modules/requests/model/requests.config';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as REQUESTS_MODELS from '../../../../feature-modules/requests/model/requests.models';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private _http: HttpService) { }


  public getMySubs(
    searchQuery: string,
    noLimit: boolean = true
  ): Observable<REQUESTS_MODELS.EmployeesListAutocompleteModel[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http
      .fetch(`${PROFILE_ENDPOINTS_BASE}/SearchMySubs${buildQueryString({searchQuery,noLimit})}`)
      .pipe(
        map(
          (
            res: ApiResponse<REQUESTS_MODELS.EmployeesListAutocompleteModel[]>
          ) => {
            return res.result;
          }
        )
      );
  }
  
  searchEmployee(filterValue:string){
    return this._http.fetch(`Profile/SearchEmployees${buildQueryString({'searchQuery':filterValue,exceptCurrentProfile:false})}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.EmployeeModel[]>) => res.result)
    )
  }


  searchTeams(searchQuery: string) {
    return this._http.fetch(`Request/GetAllTeams${buildQueryString({ searchQuery })}`).pipe(
      map((res: ApiResponse<REQUESTS_MODELS.TeamModel[]>) => res.result)
    )
  }

  searchCycles(searchQuery: string) {
    return this._http.fetch(`Request/GetAllCycles`).pipe(
      map((response:ApiResponse<REQUESTS_MODELS.CycleModel[]>) => response.result.filter(option => {
        return option.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === 0
      }))
    )
  }

  searchSkill(searchQuery: string) {
    return this._http.fetch(`Request/FindSkill`).pipe(
      map((response: ApiResponse<REQUESTS_MODELS.skillModel[]>) => response.result.filter(option => {
        return option.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === 0
      }))
    )
  }

  // get  Technical interviewers list


  public searchTechnialInterviewer(searchQuery: string): Observable<REQUESTS_MODELS.TechnicalInterviewer[]> {
    searchQuery = searchQuery.trim().replace(/  +/g, ' ');
    return this._http.fetch(`${PROFILE_ENDPOINTS_BASE}/SearchEmployees${buildQueryString({ searchQuery, exceptCurrentProfile: false })}`).pipe(
      map(
        (res: ApiResponse<REQUESTS_MODELS.TechnicalInterviewer[]>) => res.result
      )
    )
  }
  searchRole(query: string){
    return this._http.fetch(`Request/GetProfileRoles`).pipe(
      map((response: ApiResponse<REQUESTS_MODELS.ProfileRoles[]>) => response.result.filter(option => {
        return option.name.toLowerCase().indexOf(query.toLowerCase()) === 0
      }))
    )
  }

  searchClient(searchQuery: string) {
    return this._http.fetch(`Request/FindSkill`).pipe(
      map((response: ApiResponse<REQUESTS_MODELS.skillModel[]>) => response.result.filter(option => {
        return option.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === 0
      }))
    )
  }
}
