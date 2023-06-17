import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { loggedInUserModel } from '@core/modules/user/model/user.model';
import { UserState } from '@core/modules/user/state/user.state';
import { HeadInformationModel, HeadRefresherType } from '@core/services/head-refresher/head-refresher.models';
import { HeadRefresherService } from '@core/services/head-refresher/head-refresher.service';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@environments/environment';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'ssa-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, HeadRefresherType {

  @Select(OrganizationState.org) public myOrganization$: Observable<string[]>;
  @ViewSelectSnapshot(UserState.user) public user: loggedInUserModel;

  public organization: any;
  public environment : any;


  public headInformation: HeadInformationModel = {
    title: 'Home'
  }

  constructor(
    private _store: Store,
    private _router: Router,
    private _storage: StorageService,
    private _headRefresher: HeadRefresherService
  ) {
     this._router.navigate([{
        outlets: { 'side-panel': null }
      }])
   }


  ngOnInit(): void {
    if (this._storage.get('returnURL', this._storage.SESSION_STORAGE)) {
      this._router.navigate([this._storage.get('returnURL', this._storage.SESSION_STORAGE)])
      this._storage.remove('returnURL', this._storage.SESSION_STORAGE)
    }

    this.environment = environment;


    this.myOrganization$.subscribe(res => {
      if (res) this.organization = res
      else this._store.dispatch(new GetMyOrganization())
    })
    this.refreshHeadInformation();


    
    
  }


  public refreshHeadInformation(): void {
    this._headRefresher.refresh(this.headInformation);
  }



}
