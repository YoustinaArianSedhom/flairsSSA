import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageMyRequestsComponent } from './pages/manage-my-requests/manage-my-requests.component';
import { CreateRecruitmentFormComponent } from './components/managers requests/create-recruitment-form/create-recruitment-form.component';

const routes: Routes = [
  { path: '', component: ManageMyRequestsComponent},
  { path: 'create-recruitment', component: CreateRecruitmentFormComponent },
  { path: 'edit-recruitment/:id', component: CreateRecruitmentFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRequestsRoutingModule { }
