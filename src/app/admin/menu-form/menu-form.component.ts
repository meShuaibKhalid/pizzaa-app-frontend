import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subject, take, takeUntil } from 'rxjs';
import { PiZZA_CATEGORY } from 'src/app/shared/consts/category.const';
import { PizzaI } from 'src/app/shared/interfaces/pizza.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuFormComponent implements OnInit, OnDestroy {
  menuForm: FormGroup;
  pizzaCategory = PiZZA_CATEGORY;
  fileName: string = '';
  pizza_id: string;
  $destroy = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeMenuForm();
    this.pizza_id = this.route.snapshot.params['id'];
    if (this.pizza_id && this.pizza_id.length) {
      this.getDataById(this.pizza_id);
    }
  }

  public initializeMenuForm(): void {
    this.menuForm = this.fb.group({
      image: ['', Validators.required],
      name: ['', Validators.required],
      quantity: [null, Validators.required],
      status: [null],
      available: [false, Validators.required],
      category: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  get imageControl() {
    return this.menuForm.controls['image'];
  }

  public getDataById(id: string) {
    this.httpService
      .getData(`${environment.baseUrl}/pizza/${id}`)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (response: PizzaI) => {
          this.menuForm.patchValue(response);
        },
        (error) => {
          this.toastr.error(error.error.message ?? JSON.stringify(error));
        }
      );
  }

  public onSubmit(): void {
    if (this.pizza_id) {
      this.httpService
        .updateData(
          `${environment.baseUrl}/pizza/update/${this.pizza_id}`,
          this.menuForm.value
        )
        .pipe(take(1))
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.success(res.message);
            }
          },
          (error) => {
            this.toastr.error('Unable to Add Menu Item');
          }
        );
    } else {
      this.httpService
        .addData(`${environment.baseUrl}/pizza/add`, this.menuForm.value)
        .pipe(take(1))
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.success(res.message);
            }
          },
          (error) => {
            this.toastr.error('Unable to Add Menu Item');
          }
        );
    }

    setTimeout(() => {
      this.router.navigate(['/admin/dashboard/menu']);
    }, 2000);
  }

  public onFileSelected(event) {
    let file = event.target.files[0];
    this.fileName = file.name;
    let reader = new FileReader();
    reader.onloadend = () => {
      this.menuForm.patchValue({ image: reader.result });
    };
    reader.readAsDataURL(file);
  }

  public deleteImage() {
    this.menuForm.patchValue({ image: null });
  }

  ngOnDestroy(): void {
    this.$destroy.next(null);
    this.$destroy.complete();
  }
}
