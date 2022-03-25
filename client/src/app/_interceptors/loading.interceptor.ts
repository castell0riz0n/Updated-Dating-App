import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {delay, finalize, Observable} from 'rxjs';
import {SpinnerService} from "../_services/spinner.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private spinnerSv: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.spinnerSv.busy();
    return next.handle(request).pipe(
      delay(1500),
      finalize(() => {
        this.spinnerSv.idle();
      })
    )
  }
}
