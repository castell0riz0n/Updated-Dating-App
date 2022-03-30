import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../../_models/message";
import {MessageService} from "../../../_services/message.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberMessagesComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() username: string;
  content: string = '';
  @ViewChild('form') form: NgForm;

  constructor(
    public messageService: MessageService
  ) {
  }

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.content)
      .then(() => {
        this.form.reset();
      });
  }

}
