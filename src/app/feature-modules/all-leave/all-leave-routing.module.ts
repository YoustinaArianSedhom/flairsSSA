import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLeaveGuard } from './guards/all-leave.gaurd';
import { AllLeaveComponent } from './pages/all-leave/all-leave.component';

const routes: Routes = [
  { path: '', component: AllLeaveComponent, canActivate: [AllLeaveGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllLeaveRoutingModule { }
