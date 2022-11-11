import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/guards/auth.service';
import { LocalStorageService } from 'src/app/shared';
import { OrderI } from 'src/app/shared/interfaces/order.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  @Input() items;
  @Input() totalPrice;
  userId: string = '';
  addressForm: FormGroup = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    address: [null, Validators.required],
    comment: [''],
  });
  hasUnitNumber = false;
  private $destroy = new Subject<void>();

  ngOnInit(): void {
    const token = this.localStorageService.get('user');
    this.userId = this.authService.getDecodedAccessToken(token).id;
  }

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private httpService: HttpService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  private filterProducts() {
    this.items.forEach((item) => {
      delete item['status'];
      delete item['image'];
      delete item['available'];
      delete item['_v'];
    });
  }

  private createOrder(): OrderI {
    this.filterProducts();
    return {
      customerId: this.userId,
      customerName: `${this.addressForm.value.firstName} ${this.addressForm.value.lastName}`,
      items: this.items,
      deliveryET: new Date(new Date().getTime() + 30 * 60000).toLocaleString(
        'en-US',
        {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }
      ),
      status: 'placed',
      address: this.addressForm.value.address,
      comment: this.addressForm.value.comment,
      price: this.totalPrice,
    };
  }

  onSubmit(): void {
    const data = this.createOrder();
    this.httpService
      .addData(`${environment.baseUrl}/order/add`, data)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (res) => {
          this.toastr.success(res.message);
          this.localStorageService.delete('cart');
        },
        (error) => {
          this.toastr.error('Unable to Add Menu Item');
        }
      );

    setTimeout(() => {
      this.router.navigate(['/user/view-order']);
    }, 2000);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
