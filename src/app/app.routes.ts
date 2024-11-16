import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HomeComponent } from './modules/home/home.component';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./auth/login/login.component').then( m => m.LoginComponent)},
    { path: 'app',
        component: LayoutComponent,
        children: [
          { path: '', component: HomeComponent },
        ]
      },
      { path: '**', redirectTo: '' }
];
