import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { MyTasksRoutingModule } from './my-tasks-routing.module';
import { MyTasksComponent } from './pages/manage-my-tasks/my-tasks.component';
import { SharedModule } from '@shared/shared.module';
import { TableMyTasksComponent } from './components/table-my-tasks/table-my-tasks/table-my-tasks.component';
import { NgxsModule } from '@ngxs/store';
import { MyTasksState } from './state/my-tasks.state';
import { CardMyTasksComponent } from './components/card-my-tasks/card-my-tasks.component';
import { CardsWrapperMyTasksComponent } from './components/cards-wrapper-my-tasks/cards-wrapper-my-tasks.component';
import { InjectableFormComponent } from './components/injectable-form/injectable-form.component';


@NgModule({
  declarations: [MyTasksComponent, TableMyTasksComponent, CardMyTasksComponent, CardsWrapperMyTasksComponent, InjectableFormComponent],
  imports: [
    CommonModule,
    MyTasksRoutingModule,
    SharedModule,
    NgxsModule.forFeature([MyTasksState])
  ],
  providers:[DecimalPipe]
})
export class MyTasksModule { }
