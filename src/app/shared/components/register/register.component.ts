import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  private _destroySub$ = new Subject<void>();

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.initializeRegisterForm();
  }

  private initializeRegisterForm(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      role: ['user', Validators.required],
      address: ['', Validators.required],
      other: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.httpService
      .addData(`${environment.baseUrl}/users/register`, this.registerForm.value)
      .pipe(takeUntil(this._destroySub$))
      .subscribe(
        (response) => {
          this.localStorageService.set('user', response);
          this.toastr.success('Successfully Registered');
          this.router.navigate(['']);
        },
        ({ error }) => {
          this.toastr.error(error.message);
        }
      );
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }
}
