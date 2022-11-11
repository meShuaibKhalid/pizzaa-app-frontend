import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { LocalStorageService } from 'src/app/shared';
import { PizzaI } from 'src/app/shared/interfaces/pizza.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  menuList: PizzaI[];
  private $destroy = new Subject<void>();
  defaultPageSize = 5;
  totalCount;
  totalPages;
  currentPage: number = 1;
  searchText: string;
  isPreviousBtnDisabled = false;
  isNextBtnDisabled = false;
  constructor(
    private localStorageService: LocalStorageService,
    private httpService: HttpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.localStorageService.get('cart') || [];
    this.getData();
  }

  public getData() {
    this.httpService
      .addData(`${environment.baseUrl}/pizza`, {
        perPage: this.defaultPageSize,
        page: this.currentPage,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: any) => {
          this.totalCount = response.count;
          this.menuList = response.data;
          this.menuList.forEach((item) => {
            item.quantity === 0 ? (item.available = false) : item.quantity;
          });
          this.totalPages = Math.ceil(this.totalCount / this.defaultPageSize);
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public addToCart(data) {
    let newData = { ...data };
    newData.quantity = 1;
    if (this.cartItems.length) {
      const duplicate = this.cartItems.find((item) => item._id === data._id);
      if (duplicate) {
        duplicate.quantity = duplicate.quantity + newData.quantity;
        duplicate.price = duplicate.price + newData.price;
      } else {
        this.cartItems = [...this.cartItems, newData];
      }
    } else {
      const newData = { ...data };
      newData.quantity = 1;
      this.cartItems = [...this.cartItems, newData];
    }
    this.localStorageService.set('cart', this.cartItems);
    this.toastr.success('Item added to cart');
  }

  back() {
    this.currentPage--;
    this.getData();
  }

  next() {
    this.currentPage++;
    this.getData();
  }

  public getValue(searchText) {
    if(typeof(searchText) == "string") {
      this.searchText = searchText;
    } else {
      this.searchText = "";
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }
}
