import {Component, OnInit} from '@angular/core';
import {Message} from "../../_models/message";
import {Pagination} from "../../_models/pagination";
import {MessageService} from "../../_services/message.service";
import {ConfirmService} from "../../_services/confirm.service";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  container = 'Inbox';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService,
              private ConfirmSv: ConfirmService) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(res => {
        this.messages = res.result;
        this.pagination = res.pagination;
        this.loading = false;
      });
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id: number) {
    this.ConfirmSv.confirm('Delete Message!', "Are you sure deleting this message?").subscribe(res => {
      if (res) {
        this.messageService.deleteMessage(id).subscribe(() => {
          this.messages.splice(this.messages.findIndex(a => a.id === id), 1);
        });
      }
    });

  }
}
