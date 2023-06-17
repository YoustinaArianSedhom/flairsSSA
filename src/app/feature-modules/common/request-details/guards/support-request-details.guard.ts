import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SSAConfigInst } from 'src/app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class SupportRequestDetailsGuard implements CanActivate {
  constructor(private _router: Router, private _store: Store) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._store.select(AuthorizationState.isWorkflowManagement).pipe(
      map((isAuthorized) => {
        if (isAuthorized) return true;
        this._router.navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]);
        return false
      })
    )
  }

}
