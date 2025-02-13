import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent:() => import('./forms/login/login.component').then((m) => m.LoginComponent)  
    },
    {
        path: 'register',
        loadComponent:() => import('./forms/register/register.component').then((m) => m.RegisterComponent)  
    },
    {
        path: 'admin',
        loadComponent:() => import('./admin/admin.component').then((m) => m.AdminComponent)  
    },
    {
        path: '',
        loadComponent: () => import('./primary-page/primary-page.component').then((m) => m.PrimaryPageComponent),
        children:[
            {
                path: 'home',
                loadComponent: () => import('./primary-page/home/home.component').then((m) => m.HomeComponent)
            },
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
