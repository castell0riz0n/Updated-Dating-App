import {Component, OnInit} from '@angular/core';
import {Member} from "../../_models/member";
import {MembersService} from "../../_services/members.service";
import {Pagination} from "../../_models/pagination";

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Partial<Member[]>;
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination

  constructor(
    private memberSv: MembersService
  ) {
  }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberSv.getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe(res => {
        this.pagination = res.pagination;
        this.members = res.result;
      });
  }

  pageChanged(event: any){
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
