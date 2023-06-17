import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SSAConfigInst } from 'src/app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class MyTeamLeaveGuard implements CanActivate {
  constructor(private _store: Store, private _router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._store.select(AuthorizationState.isViewTeamLeave).pipe(
      map((isPermissionManagement) => {
        if (isPermissionManagement) return true;
        this._router.navigate([SSAConfigInst.ROUTES_CONFIG.forbidden]);
        return false;
      })
    )
  }

}
