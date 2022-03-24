import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};
  constructor(
    public accountSv: AccountService,
    private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.accountSv.login(this.model)
      .subscribe(res => {
        this.router.navigateByUrl('/members')
      });
  }

  logout(){
    this.accountSv.logout();
    this.router.navigateByUrl('/');
  }
}
