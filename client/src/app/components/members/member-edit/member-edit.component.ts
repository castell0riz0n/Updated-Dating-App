import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../../_models/member";
import {User} from "../../../_models/user.interface";
import {AccountService} from "../../../_services/account.service";
import {MembersService} from "../../../_services/members.service";
import {take} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member: Member;
  user: User;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  @ViewChild('editForm') editForm: NgForm;
  constructor(
    private accountSv: AccountService,
    private memberSv: MembersService,
    private toastr: ToastrService
  ) {
    this.accountSv.currentUser$.pipe(take(1)).subscribe(res => this.user = res);
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.memberSv.getMember(this.user.userName).subscribe(mem => this.member = mem);
  }

  updateMember(){
    this.memberSv.updateMember(this.member).subscribe(() => {
      this.editForm.reset(this.member);
      this.toastr.success('Profile updated successfully','Yeeey');
    })
  }

}
