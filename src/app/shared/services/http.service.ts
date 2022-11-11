import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getData(url: string, obj?: any): Observable<any> {
    return this.http.get(url, obj);
  }

  addData(url: string, obj?: any): Observable<any> {
    return this.http.post(url, obj);
  }

  updateData(url: string, obj: any): Observable<any> {
    return this.http.put(url, obj);
  }

  deleteData(url: string): Observable<any> {
    return this.http.delete(url);
  }

  patchData(url: string, obj: any): Observable<any> {
    return this.http.patch(url, obj);
  }
}
