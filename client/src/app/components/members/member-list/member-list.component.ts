import { Component, OnInit } from '@angular/core';
import {MembersService} from "../../../_services/members.service";
import {Member} from "../../../_models/member";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];

  constructor(
    private memberSv: MembersService
  ) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberSv.getMembers().subscribe(members => {
      this.members = members;
    })
  }
}
