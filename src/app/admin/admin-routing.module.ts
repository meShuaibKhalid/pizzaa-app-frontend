import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from '../nav/nav.component';
import { MenuFormComponent } from './menu-form/menu-form.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: NavComponent,
    children: [
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
      },
      {
        path: 'menu',
        component: MenuListComponent,
      },
      {
        path: 'add-menu',
        component: MenuFormComponent,
      },
      {
        path: 'edit-menu/:id',
        component: MenuFormComponent,
      },
      {
        path: 'order-details',
        component: OrderDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
