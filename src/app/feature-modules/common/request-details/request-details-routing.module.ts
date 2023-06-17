import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestDetailsComponent } from './pages/request-details/request-details.component';
import { SupportRequestDetailsComponent } from './pages/support-request-details/support-request-details.component';
import { SupportRequestDetailsGuard } from './guards/support-request-details.guard';

const routes: Routes = [
  {
    path: ':id',
    component: RequestDetailsComponent,
  },
  {
    path:'support/:id',
    component: SupportRequestDetailsComponent, canLoad:[SupportRequestDetailsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestDetailsRoutingModule { }
