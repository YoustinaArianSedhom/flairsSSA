import { SSAConfigInst } from './../../../config/app.config';
import { map } from 'rxjs/operators';
import { AuthorizationState } from './../../../core/modules/authorization/state/authorization.state';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyTeamsTasksGuard implements CanActivate {
  constructor(private _store: Store,
              private _router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._store.select(AuthorizationState.isViewMyTeamsTasks).pipe(
      map((isAuthorized) => {
        if(isAuthorized) return true;
        this._router.navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]);
        return false
      })
    );
  }
  
}
