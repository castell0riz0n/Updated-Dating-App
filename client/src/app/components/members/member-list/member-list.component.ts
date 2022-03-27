import { Component, OnInit } from '@angular/core';
import {MembersService} from "../../../_services/members.service";
import {Member} from "../../../_models/member";
import {Observable, take} from "rxjs";
import {Pagination} from "../../../_models/pagination";
import {UserParams} from "../../../_models/userParams";
import {AccountService} from "../../../_services/account.service";
import {User} from "../../../_models/user.interface";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  private user: User;

  genderList = [
    {value: 'male', display: 'Males'},
    {value: 'female', display: 'Females'}
  ]

  constructor(
    private memberSv: MembersService
  ) {
    this.userParams = this.memberSv.getUserParams()
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberSv.setUserParams(this.userParams);
    this.memberSv.getMembers(this.userParams).subscribe(res => {
      this.members = res.result;
      this.pagination = res.pagination;
    })
  }

  pageChanged(e: any){
    this.userParams.pageNumber = e.page;
    this.memberSv.setUserParams(this.userParams);
    this.loadMembers();
  }

  resetFilters(){
    this.userParams = this.memberSv.resetUserParams();
    this.loadMembers();
  }
}
