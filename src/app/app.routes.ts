import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/tickets/pages/ticket-list/ticket-list.component')
              .then(m => m.TicketListComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./modules/tickets/pages/ticket-form/ticket-form.component')
              .then(m => m.TicketFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./modules/tickets/pages/ticket-form/ticket-form.component')
              .then(m => m.TicketFormComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./modules/tickets/pages/ticket-detail/ticket-detail.component')
              .then(m => m.TicketDetailComponent)
          },
          {
            path: ':id/history',
            loadComponent: () => import('./modules/tickets/pages/ticket-history/ticket-history.component')
              .then(m => m.TicketHistoryComponent)
          }
        ]
      }
    ]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];
