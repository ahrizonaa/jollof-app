import { Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import LoginGuard from './guard/loginguard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    component: SigninComponent,
    canActivate: [LoginGuard],
  },
];
