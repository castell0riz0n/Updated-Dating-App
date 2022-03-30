import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {MemberEditComponent} from "../components/members/member-edit/member-edit.component";
import {ConfirmService} from "../_services/confirm.service";

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
  constructor(private ConfirmSv: ConfirmService) {
  }
  canDeactivate(component: MemberEditComponent): Observable<boolean> | boolean {
    if (component.editForm.dirty){
      return this.ConfirmSv.confirm();
    }
    return true;
  }

}
