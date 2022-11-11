import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/guards/auth.service';
import { LocalStorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginValid = true;
  private _destroySub$ = new Subject<void>();
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  public ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.loginValid = true;
    this.authService
      .login(this.loginForm.value)
      .pipe(takeUntil(this._destroySub$))
      .subscribe(
        (response) => {
          this.localStorageService.set('user', response);
          this.toastr.success('Successfully Logged In');
          const role = this.authService.getDecodedAccessToken(response).role;
          setTimeout(() => {
            role == 'admin'
              ? this.router.navigate(['/admin/dashboard'])
              : this.router.navigate(['/user/items']);
          }, 1000);
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
