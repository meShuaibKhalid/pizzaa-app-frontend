import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared';
import { PiZZA_CATEGORY } from 'src/app/shared/consts/category.const';
import { PizzaI } from 'src/app/shared/interfaces/pizza.interface';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
})
export class CartItemsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'quantity',
    'category',
    'Actions',
  ];
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  isCheckout: boolean = false;
  cartItems: PizzaI[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private toastr: ToastrService
  ) {}

  get totalPrcie(): number {
    return this.cartItems.reduce((a, b) => a + b.price, 0);
  }

  ngOnInit(): void {
    this.cartItems = this.localStorageService.get('cart') || [];
    this.cartItems.forEach((item) => {
      PiZZA_CATEGORY.forEach((category) => {
        if (item.category == category.value) {
          item.category = category.label;
        }
      });
    });
    this.dataSource = new MatTableDataSource(this.cartItems);
    this.dataSource.sort = this.sort;
  }

  removeItem(index) {
    const cartItems = [...this.cartItems];
    cartItems.splice(index, 1);
    this.cartItems = [...cartItems];
    this.dataSource = this.cartItems;
    this.localStorageService.set('cart', this.cartItems);
    this.toastr.success('Items removed from cart');
  }

  public openCheckout(): void {
    this.isCheckout = !this.isCheckout;
  }

  public decrement(i: number) {
    this.cartItems.forEach((item, index) => {
      if (i === index) {
        const itemPrice = item.price / item.quantity;
        item.quantity = item.quantity - 1;
        item.price = item.price - itemPrice;
        if (item.quantity === 0) {
          this.removeItem(i);
        }
      }
    });
    this.localStorageService.set('cart', this.cartItems);
  }

  public increment(i: number) {
    this.cartItems.forEach((item, index) => {
      if (i === index) {
        const itemPrice = item.price / item.quantity;
        item.quantity = item.quantity + 1;
        item.price = item.price + itemPrice;
      }
    });
    this.localStorageService.set('cart', this.cartItems);
  }
}
