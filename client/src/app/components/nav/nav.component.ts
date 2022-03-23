import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {Observable} from "rxjs";
import {User} from "../../_models/user.interface";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(public accountSv: AccountService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountSv.login(this.model)
      .subscribe(res => {
        console.log(res)
      }, error => {
        console.error(error);
      });
  }

  logout(){
    this.accountSv.logout();
  }
}
