import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RequestInterceptor } from './interceptors/requestInterceptor';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  exports: [],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
})
export class CoreModule {
  constructor() {
  }
}
