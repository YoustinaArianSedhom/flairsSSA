import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRequestsGuard } from './guards/all-requests.guard';
import { ManageAllRequestsComponent } from './pages/manage-all-requests/manage-all-requests.component';

const routes: Routes = [{ path: '', component: ManageAllRequestsComponent , canActivate: [AllRequestsGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllRequestsRoutingModule { }
