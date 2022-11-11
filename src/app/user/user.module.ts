import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ItemListComponent } from './item-list/item-list.component';
import { SharedModule } from '../shared/shared.module';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../shared/pipes/filter.pipe';
import { ViewOrderDetailsComponent } from './view-order-details/view-order-details.component';


@NgModule({
  declarations: [
    ItemListComponent,
    CartItemsComponent,
    CheckoutComponent,
    FilterPipe,
    ViewOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserModule { }
