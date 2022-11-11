import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartItems: Subject<any> = new ReplaySubject<any>(1);

  public getCartItems(): Observable<any> {
    return this.cartItems.asObservable();
  }
}
