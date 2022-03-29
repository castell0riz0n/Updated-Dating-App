import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {take} from "rxjs";
import {User} from "../../_models/user.interface";

@Directive({
  selector: '[userHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() userHasRole: string[];
  private user: User;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountSv: AccountService
  ) {
    this.accountSv.currentUser$.pipe(take(1))
      .subscribe(res => this.user = res);
  }

  ngOnInit(): void {
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }
    if (this.user?.roles.some(r => this.userHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
