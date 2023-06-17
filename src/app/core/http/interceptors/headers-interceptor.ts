import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    public flag = false;
    public firstTimeFlag = true;
    private _renewSessionTime:number = 2
    constructor(
        private _store: Store,
        private _oauthService: OAuthService

    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            headers: request.headers
            .set('Tenant-Key', 'flairstech')
        });
        //validate request time is before of the expiration time of token with the renewSessionTime. 
        if (this._oauthService.getAccessTokenExpiration() - (1000 * 60 * this._renewSessionTime) < new Date().getTime() && new Date().getTime() < this._oauthService.getAccessTokenExpiration() && this.firstTimeFlag) {
            this.flag = true;
            this.firstTimeFlag = false
            this.refreshToken();
        }
        return next.handle(request);
    }

    // Handle refreshToken while user is active

    public refreshToken() {
        setTimeout(() => {
            if (this.flag) {
                this._oauthService.refreshToken().then((res) => {
                    this.firstTimeFlag = true
                })
                this.flag = false
            }
        }, 300);
    }
}
