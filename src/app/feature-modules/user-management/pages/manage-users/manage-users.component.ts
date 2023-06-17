import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import * as USER_MANAGEMENT_ACTIONS from '@modules/user-management/state/user-management.actions';
import { UserManagementState, UserManagementStateModel } from '@modules/user-management/state/user-management.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { StateOverwrite } from 'ngxs-reset-plugin';
import * as USER_MANAGEMENT_MODELS from '../../model/user-management.models'
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';


@Component({
  selector: 'ssa-manage-users',
  templateUrl: './manage-users.component.html',
  styles: [
    `
      :host {
        display: block;
      }
      .btn-req{
        margin-top:7px;
      }
    `
  ]
})
export class ManageUsersComponent implements OnInit, OnDestroy, HeadRefresherType {

  @ViewSelectSnapshot(UserManagementState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(AuthorizationState.systemRoles) private _systemRoles: string[];
  
  public isMobile: boolean;
  public headInformation = {
    title: 'Users Management'
  }
  public permissionsOptions: USER_MANAGEMENT_MODELS.UsersRolesModel[];
  public permissionsSelectionConfig: BasicSelectConfigModel = {
    placeholder: 'Permissions',
    multiple: true,
    value: this._store.selectSnapshot(UserManagementState.filtration).permissions ?? []
  }

  constructor(
    private _breakpointsObserver: BreakpointObserver,
    private _router: Router,
    private _headRefresher: HeadRefresherService,
    private _store: Store
  ) {
    this._router.navigate([{
      outlets: { 'side-panel': null }
    }])
  }

  /* _____________________ Actions Fires ________________________*/

  @Dispatch() public fireFilterUsers(filtration: USER_MANAGEMENT_MODELS.UsersManagementFiltrationModel) { return new USER_MANAGEMENT_ACTIONS.FilterUsers(filtration)}
  @Dispatch() public fireResetFiltration() { return new USER_MANAGEMENT_ACTIONS.ResetFiltration()}
  @Dispatch() private _fireStateResetAction() {
    return new StateOverwrite([UserManagementState, new UserManagementStateModel()])
  }

  ngOnInit(): void {
    this.refreshHeadInformation();
    // @todo move this functionality into layout service to be available cross over the system
    // and to resolve the duplication
    this.isMobile = this._breakpointsObserver.isMatched('(max-width: 768px)');
    this.permissionsOptions = this._systemRoles.map(role=> ({id: role, name: role}))
  }

  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }

  public onSearchChange(searchQuery: string): void {
    this.fireFilterUsers({searchQuery})
  }

  public onRoleSelect(permissions: string[]): void{
    this.fireFilterUsers({permissions})
  }

  public resetFilter(){
    this.fireResetFiltration();
    this.permissionsSelectionConfig = {...this.permissionsSelectionConfig, value: this._store.selectSnapshot(UserManagementState.filtration).permissions ?? []}
  }

  ngOnDestroy() {
    this._fireStateResetAction();
  }

}
