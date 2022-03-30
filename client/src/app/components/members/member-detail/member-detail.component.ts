import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../../_models/member";
import {MembersService} from "../../../_services/members.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from "@kolkov/ngx-gallery";
import {TabDirective, TabsetComponent} from "ngx-bootstrap/tabs";
import {MessageService} from "../../../_services/message.service";
import {Message} from "../../../_models/message";
import {PresenceService} from "../../../_services/presence.service";
import {User} from "../../../_models/user.interface";
import {AccountService} from "../../../_services/account.service";
import {take} from "rxjs";

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages: Message[] = [];
  user: User;
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
activeTab: TabDirective;
  constructor(
    private memberSv: MembersService,
    public presenceSv: PresenceService,
    private route: ActivatedRoute,
    private messageSv: MessageService,
    private accountSv: AccountService,
    private router: Router
  ) {
    this.accountSv.currentUser$.pipe(take(1)).subscribe(res => this.user = res);
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(da => {
      this.member = da.member;
    })
    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab): this.selectTab(0)
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }

    return imageUrls;
  }

  loadMessages(){
    this.messageSv.getMessageThread(this.member.username).subscribe(res => this.messages = res);
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.messageSv.createHubConnection(this.user, this.member.username)
    } else{
      this.messageSv.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageSv.stopHubConnection();
  }
}
