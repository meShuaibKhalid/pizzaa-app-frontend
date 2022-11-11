import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared';
import { CustomerLoginI } from 'src/app/shared/interfaces/customer.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpService: HttpService, private localStorageService: LocalStorageService) {}

  /**
   *
   * @param payload
   * @returns
   */
  login(payload: CustomerLoginI) {
    return this.httpService.addData(`${environment.baseUrl}/users/login`, payload);
  }

  public isLoggedin(): boolean {
    return !!this.localStorageService.get("user");
  }

  public getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

}
