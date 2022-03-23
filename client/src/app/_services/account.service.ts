import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, ReplaySubject} from "rxjs";
import {User} from "../_models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model)
      .pipe(
        map((res: User) => {
          const user = res;
          if (user){
            localStorage.setItem('user', JSON.stringify(res));
            this.currentUserSource.next(user);
          }
        })
      )
  }

  register(model: any){
   return this.http.post(this.baseUrl + 'account/register', model)
      .pipe(
        map((res: User) => {
          if (res){
            localStorage.setItem('user', JSON.stringify(res))
            this.currentUserSource.next(res);
          }
        })
      );
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
