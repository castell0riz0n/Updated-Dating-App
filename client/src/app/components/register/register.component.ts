import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AccountService} from "../../_services/account.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() registerEvent = new EventEmitter<boolean>();
  model: any = {};

  constructor(private accountSv: AccountService) {
  }

  ngOnInit(): void {
  }

  register() {
    this.accountSv.register(this.model).subscribe(res => {
      this.cancel();
    });
  }

  cancel() {
    this.registerEvent.emit(false)
  }
}
