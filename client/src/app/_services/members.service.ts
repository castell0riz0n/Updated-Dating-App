import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Member} from "../_models/member";
import {map, of, take} from "rxjs";
import {PaginatedResult} from "../_models/pagination";
import {UserParams} from "../_models/userParams";
import {AccountService} from "./account.service";
import {User} from "../_models/user.interface";
import {getPaginatedResult, getPaginationHeaders} from "./pagination-helper";

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.baseUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient,
              private accountSv: AccountService
  ) {
    this.accountSv.currentUser$.pipe(take(1)).subscribe(res => {
      this.user = res;
      this.userParams = new UserParams(this.user)
    })
  }

  getUserParams(){
    return this.userParams;
  }
  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  setUserParams(params: UserParams){
    this.userParams = params;
  }

  getMembers(userParams: UserParams) {

    let response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response){
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(res => {
        this.memberCache.set(Object.values(userParams).join('-'), res);
        return res;
      }));
  }


  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((mem: Member) => mem.username === username);

    if (member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string){
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number){
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
  }
}
