import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseHistoryPageRoutingModule } from './expense-history-page-routing.module';
import { ManageExpenseHistoryPageComponent } from './pages/manage-expense-history-page/manage-expense-history-page.component';
import { TableExpenseHistoryComponent } from './components/table-expense-history/table-expense-history.component';
import { NgxsModule } from '@ngxs/store';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { SharedModule } from '@shared/shared.module';
import { ExpenseState } from './state/expense-history.state';
import { ExpenseHistoryCardComponent } from './components/expense-history-card/expense-history-card.component';
import { CardsWrapperExpenseHistoryComponent } from './components/cards-wrapper-expense-history/cards-wrapper-expense-history.component';


@NgModule({
  declarations: [
    ManageExpenseHistoryPageComponent,
    TableExpenseHistoryComponent,
    ExpenseHistoryCardComponent,
    CardsWrapperExpenseHistoryComponent
  ],
  imports: [
    CommonModule,
    ExpenseHistoryPageRoutingModule,
    SharedModule,
    SharedComponentsModule,
    NgxsModule.forFeature([ExpenseState])
  ]
})
export class ExpenseHistoryPageModule { }
