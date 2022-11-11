import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DialogDataComponent } from 'src/app/shared/components/dialog-data/dialog-data.component';
import { OrderI } from 'src/app/shared/interfaces/order.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'customer_name',
    'address',
    'items',
    'deliveryTime',
    'expectedTime',
    'status',
    'price',
    'comment',
    'Actions',
  ];
  dataSource;
  defaultPageSize = 5;
  totalCount;
  totalPages;
  currentPage: number = 1;
  orders: any[] = [];
  isData: boolean = false;
  @ViewChild(MatSort) sort: MatSort;

  private $destroy = new Subject<void>();

  constructor(
    private httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getData();
  }

  public getData() {
    this.httpService
      .addData(`${environment.baseUrl}/order`, {
        perPage: this.defaultPageSize,
        page: this.currentPage,
      })
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: any) => {
          if (response.data.length) this.isData = true;
          this.totalCount = response.count;
          this.totalPages = Math.ceil(this.totalCount / this.defaultPageSize);
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public removeOrder(row: OrderI | any) {
    this.httpService
      .addData(`${environment.baseUrl}/order/delete/${row._id}`)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: OrderI[]) => {
          this.toastr.success('Order Removed Successfully');
          this.getData();
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public updateOrder(statusValue, orderInfo: OrderI | any) {
    orderInfo.items.forEach((item) => {
      this.orders.push({ id: item._id, quantity: item.quantity });
    });
    orderInfo.status = statusValue;
    if (statusValue === 'delivered') {
      orderInfo.deliveryAT = new Date(
        new Date().getTime() + 30 * 60000
      ).toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    this.httpService
      .updateData(
        `${environment.baseUrl}/order/update/${orderInfo._id}`,
        orderInfo
      )
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: OrderI[]) => {
          this.toastr.success('Order Updated Successfully');
          if (statusValue === 'delivered') this.decrementProduct();
          this.getData();
          this.orders = [];
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public decrementProduct() {
    this.orders.forEach((orderedItem) => {
      this.getDataById(orderedItem.id)
        .pipe(takeUntil(this.$destroy))
        .subscribe((item) => {
          if (item && item.quantity) {
            item.quantity = item.quantity - orderedItem.quantity;
            this.updateDataById(item._id, item)
              .pipe(takeUntil(this.$destroy))
              .subscribe();
          }
        });
    });
  }

  public getDataById(id: string) {
    return this.httpService.getData(`${environment.baseUrl}/pizza/${id}`);
  }

  public updateDataById(id: string, body) {
    return this.httpService.updateData(
      `${environment.baseUrl}/pizza/update/${id}`,
      body
    );
  }

  public openDialog(items) {
    this.dialog.open(DialogDataComponent, {
      data: items,
    });
  }

  back() {
    this.currentPage--;
    this.getData();
  }

  next() {
    this.currentPage++;
    this.getData();
  }

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }
}
