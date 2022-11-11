import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService, NavI } from '../..';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.css'],
})
export class UserNavComponent implements OnInit {
  @Input() set cart(data) {
    this.cartItems = this.localStorageService.get('cart');
  }
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  get cartItemQuantity() {return this.cartItems.length}

  navigationItems: NavI[] = [
    {
      title: 'Pizza',
      path: '/user/items',
    },
    {
      title: 'My Profile',
      path: '/profile',
    },
  ];
  public cartItems: any[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartItems = this.localStorageService.get('cart');
  }

  public searchItems(searchText:string) {
    this.search.emit(searchText);
  }

  public logout(): void {
    this.localStorageService.clear();
    this.router.navigate(['/login'])
  }
}
