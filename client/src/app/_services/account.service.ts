import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, ReplaySubject} from "rxjs";
import {User} from "../_models/user.interface";
import {environment} from "../../environments/environment";
import {PresenceService} from "./presence.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient, private presenceSv: PresenceService) { }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model)
      .pipe(
        map((res: User) => {
          const user = res;
          if (user){
            this.setCurrentUser(user);
            this.presenceSv.createHubConnection(user);
          }
        })
      )
  }

  register(model: any){
   return this.http.post(this.baseUrl + 'account/register', model)
      .pipe(
        map((res: User) => {
          if (res){
            this.setCurrentUser(res);
            this.presenceSv.createHubConnection(res);
          }
        })
      );
  }

  setCurrentUser(user: User){
    if (user){
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles)? user.roles = roles : user.roles.push(roles);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
    }

  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceSv.stopHubConnection();
  }
}
