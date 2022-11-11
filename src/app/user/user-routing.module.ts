import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ViewOrderDetailsComponent } from './view-order-details/view-order-details.component';

const routes: Routes = [
  {
    path: 'items',
    component: ItemListComponent
  },
  {
    path: 'cart',
    component: CartItemsComponent
  },
  {
    path: 'view-order',
    component: ViewOrderDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
