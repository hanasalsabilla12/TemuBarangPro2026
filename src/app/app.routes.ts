import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'tambah',
    pathMatch: 'full'
  },

  {
    path: 'tambah',
    loadComponent: () =>
      import('./pages/tambah/tambah.page').then(
        m => m.TambahPage
      )
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(
        m => m.HomePage
      )
  }

];