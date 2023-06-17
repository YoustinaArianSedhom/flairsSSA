import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as COMMENT_MODELS from './comment.models'
import { HttpService } from '@core/http/http/http.service';
import { ApiResponse } from '@core/http/apis.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private _http: HttpService) { }

  public addCommentOnRequest(body: COMMENT_MODELS.CommentBodyModel): Observable<COMMENT_MODELS.CommentResponseModel> {
    return this._http.post(`${COMMENT_MODELS.REQUEST_ENDPOINT}/AddCommentOnRequest`, {...body}).pipe(
      map((res:ApiResponse<COMMENT_MODELS.CommentResponseModel>)=> res.result)
    )
  }
}
