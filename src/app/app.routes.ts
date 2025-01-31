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
];
