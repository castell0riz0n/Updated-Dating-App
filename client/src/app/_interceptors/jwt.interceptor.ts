import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {AccountService} from "../_services/account.service";
import {User} from "../_models/user.interface";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private accountSv: AccountService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User;
    this.accountSv.currentUser$.pipe(take(1)).subscribe(res => currentUser = res);
    if (currentUser){
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + currentUser.token
        }
      })
    }
    return next.handle(request);
  }
}
