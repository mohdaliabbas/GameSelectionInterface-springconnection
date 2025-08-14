import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HelloComponent } from './hello/hello.component';
import { HelloDashboardComponent } from './hello/hello-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hello', component: HelloComponent },
  { path: 'hello-dashboard', component: HelloDashboardComponent },
  { path: '**', redirectTo: '' }
];
