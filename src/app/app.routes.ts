import { Routes } from '@angular/router';
import { PermissionsService } from './guard/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((c) => c.RegisterComponent),
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./components/catalogo/catalogo.component').then((c) => c.CatalogoComponent),
  },
  {
    path: 'catalogo/:id',
    loadComponent: () =>
      import('./components/catalogo/catalogo.component').then((c) => c.CatalogoComponent),
  },
  {
    path: 'personalizar',
    canActivate: [PermissionsService],
    loadComponent: () =>
      import('./components/personalizar/personalizar.component').then((c) => c.PersonalizarComponent),
  },
  {
    path: 'carrito',
    canActivate: [PermissionsService],
    loadComponent: () =>
      import('./components/carrito/carrito.component').then((c) => c.CarritoComponent),
  },
  {
    path: 'pedidos',
    canActivate: [PermissionsService],
    loadComponent: () =>
      import('./components/pedidos/pedidos.component').then((c) => c.PedidosComponent),
  },
  {
    path: 'producto',
    loadComponent: () =>
      import('./components/producto/producto.component').then((c) => c.ProductoComponent),
  },
  {
    path: 'tutoriales',
    canActivate: [PermissionsService],
      loadComponent: () =>
      import('./components/tutoriales/tutoriales.component').then((c) => c.TutorialesComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/pagina404/pagina404.component').then((c) => c.Pagina404Component),
  },
];
