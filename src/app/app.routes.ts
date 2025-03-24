import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent:() => import('./forms/login/login.component').then((m) => m.LoginComponent),
        canActivate: [authGuard]
    },
    {
        path: 'register',
        loadComponent:() => import('./forms/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [authGuard]
    },
    {
        path: 'event',
        loadComponent: () => import('./primary-page/primary-page.component').then((m) => m.PrimaryPageComponent),
        children:[
            {
                path: 'home',
                loadComponent: () => import('./primary-page/home/home.component').then((m) => m.HomeComponent)
            },
            {
                path: 'events',
                loadComponent: () => import('./primary-page/events/events.component').then((m) => m.EventsComponent)
            },
            {
                path: 'admin',
                loadComponent:() => import('./admin/admin.component').then((m) => m.AdminComponent),
                canActivate: [adminGuard]
            },
        ]
    },
    {
        path: ':id',
        loadComponent: () => import('./detail/detail.component').then((m) => m.DetailComponent),
        canActivate:[adminGuard]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/login'
    }
];
