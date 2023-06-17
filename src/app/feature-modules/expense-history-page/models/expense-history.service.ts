import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { map } from 'rxjs/operators';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import * as EXPENSE_MODELS from './expense-history.models'
@Injectable({
  providedIn: 'root'
})
export class ExpenseHistoryService {

  constructor(private _http: HttpService) { }

  // Get All requests 
  public getAllExpenseRequests(pagination: PaginationConfigModel, filtration: EXPENSE_MODELS.ExpenseFiltrationModel): Observable<PaginationModel<EXPENSE_MODELS.ExpenseModel>> {
    return this._http.post(`${EXPENSE_MODELS.REQUEST_ENDPOINT}/GetAllExpenseRequests${buildQueryString(pagination)}`, filtration).pipe(
      map(
        (res: ApiResponse<PaginationModel<EXPENSE_MODELS.ExpenseModel>>) => res.result
      )
    )
  }
  // Search Managers API 
  public searchManagers(searchQuery = '',exceptCurrentProfile = false): Observable<EXPENSE_MODELS.ManagerModel[]>{
    return this._http.fetch(`${EXPENSE_MODELS.PROFILE_ENDPOINT}/searchTeamManagers${buildQueryString({searchQuery,exceptCurrentProfile})}`).pipe(
      map(
        (res: ApiResponse<EXPENSE_MODELS.ManagerModel[]>)=> res.result
      )
    )
  }
  // Export expense history with Filtration
  public exportExpenseRequests(filtration: EXPENSE_MODELS.ExpenseFiltrationModel) {
    return this._http.post(`${EXPENSE_MODELS.REQUEST_ENDPOINT}/ExportExpenseRequests`, filtration, { observe: 'response', responseType: 'blob' })
  }
}
