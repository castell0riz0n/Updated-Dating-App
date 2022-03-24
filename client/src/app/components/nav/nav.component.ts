import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {Observable} from "rxjs";
import {User} from "../../_models/user.interface";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(
    public accountSv: AccountService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountSv.login(this.model)
      .subscribe(res => {
        this.router.navigateByUrl('/members')
      }, (error: HttpErrorResponse) => {
        console.error(error);
        this.toastr.error(error.error);
      });
  }

  logout(){
    this.accountSv.logout();
    this.router.navigateByUrl('/');
  }
}
