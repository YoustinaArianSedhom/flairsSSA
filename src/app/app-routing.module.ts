import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/auth/auth.guard';
import { SomethingWentWrongComponent } from '@core/components/something-went-wrong/something-went-wrong.component';
import { ForbiddenComponent } from '@core/modules/authorization/forbidden/forbidden.component';
import { AuthorizedLayoutComponent } from './layouts/pages/authorized-layout/authorized-layout.component';
import { GuestLayoutComponent } from './layouts/pages/guest-layout/guest-layout.component';

const routes: Routes = [

  // Authorized Routes
  {
    path: 'request-details',
    loadChildren: () => import('@modules/common/request-details/request-details.module').then(m => m.RequestDetailsModule),
    canLoad: [AuthGuard],
    outlet: 'side-panel'
  },

  {
    path: '',
    component: AuthorizedLayoutComponent,
    // canLoad: [AuthGuard],
    children: [
      {
        path: 'home',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      },

      {
        path: 'my-tasks',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/my-tasks/my-tasks.module').then(m => m.MyTasksModule)
      },
      {

        path: 'my-requests',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/requests/requests.module').then(m => m.MyRequestsModule)
      },

      {
        path: 'users-management',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/user-management/user-management.module').then(m => m.UserManagementModule)
      }, {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {

        path: 'all-leave',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/all-leave/all-leave.module').then(m => m.AllLeaveModule)
      },
      {
        path: 'my-team-leave',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/my-team-leaves/my-team-leaves.module').then(m => m.MyTeamLeavesModule)
      },
      {
        path: 'my-team-requests',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/my-team-requests/my-team-requests.module').then(m => m.MyTeamRequestsModule)

      },
      {
        path: 'requests',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/all-requests/all-requests.module').then(m => m.AllRequestsModule)
      },
      {
        path:'requests/own-requests',
        redirectTo:'my-requests'
      },
      {
        path: 'expense-history',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/expense-history-page/expense-history-page.module').then(m => m.ExpenseHistoryPageModule)
      },
      {
        path: 'my-teams-tasks',
        canLoad: [AuthGuard],
        loadChildren: () => import('./feature-modules/my-teams-tasks/my-teams-tasks.module').then(m => m.MyTeamsTasksModule)
      }
    ]
  },



  // not authorized routes
  {
    path: 'guest',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@core/auth/auth.module').then(m => m.AuthModule)
      },
    ]
  },

  {
    path: 'dashboard',
    redirectTo: '/home'
  },
  


  // Exception routes
  {
    path: 'unexpected',
    component: GuestLayoutComponent,
    children: [
      {
        path: 'forbidden',
        component: ForbiddenComponent
      }, {
        path: 'not-found',
        component: SomethingWentWrongComponent
      }
    ]
  },














  {
    path: '**',
    redirectTo: 'unexpected/not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
