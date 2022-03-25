import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Member} from "../_models/member";
import {map, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.baseUrl;
  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(){
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(mem => {
        this.members = mem;
        return mem;
      })
    )
  }
  getMember(username: string){
    const member = this.members.find(a => a.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
