import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() registerEvent = new EventEmitter<boolean>();
  model: any = {};

  constructor(private accountSv: AccountService,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
  }

  register() {
    this.accountSv.register(this.model).subscribe(res => {
      this.cancel();
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.toastr.error(error.error);
    });
  }

  cancel() {
    this.registerEvent.emit(false)
  }
}
