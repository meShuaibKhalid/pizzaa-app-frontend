import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  canActivate() {
    const currentUser = this.localStorageService.get('user');
    if (currentUser?.length) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
