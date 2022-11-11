import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PiZZA_CATEGORY } from 'src/app/shared/consts/category.const';
import { PizzaI } from 'src/app/shared/interfaces/pizza.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'availability',
    'quantity',
    'category',
    'Actions',
  ];
  dataSource;
  defaultPageSize = 5;
  totalCount;
  totalPages;
  currentPage: number = 1;
  @ViewChild(MatSort) sort: MatSort;

  private $destroy = new Subject<void>();

  constructor(private httpService: HttpService, private router: Router, private toastr: ToastrService) {}
  ngOnInit(): void {
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
          this.totalPages = Math.ceil(this.totalCount / this.defaultPageSize);
          response.data.forEach((item) => {
            PiZZA_CATEGORY.forEach((category) => {
              if (item.category == category.value) {
                item.category = category.label;
              }
            });
          });
          this.dataSource = new MatTableDataSource(response.data);
          this.dataSource.sort = this.sort;
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public editMenu(row: PizzaI | any) {
    this.router.navigate(['/admin/dashboard/edit-menu', row._id]);
  }

  public deleteMenu(row: PizzaI | any) {
    this.httpService
      .addData(`${environment.baseUrl}/pizza/delete/${row._id}`)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: PizzaI[]) => {
          this.getData();
          this.toastr.success("Item Deleted Successfully")
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
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
