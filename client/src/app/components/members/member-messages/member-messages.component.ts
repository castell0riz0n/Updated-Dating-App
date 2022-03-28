import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../../_models/message";
import {MessageService} from "../../../_services/message.service";
import {MembersService} from "../../../_services/members.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() username: string;
  content: string = '';
  @ViewChild('form') form: NgForm;

  constructor(
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.content)
      .subscribe(res => {
        this.messages.push(res);
        this.form.reset();
      });
  }

}