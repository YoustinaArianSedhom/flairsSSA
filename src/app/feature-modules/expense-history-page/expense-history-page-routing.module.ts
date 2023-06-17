import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageExpenseHistoryPageComponent } from './pages/manage-expense-history-page/manage-expense-history-page.component';
import { ExpenseHistoryGuard } from './guards/expense-history.guard';

const routes: Routes = [
  { path: '', component: ManageExpenseHistoryPageComponent, canActivate: [ExpenseHistoryGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseHistoryPageRoutingModule { }
