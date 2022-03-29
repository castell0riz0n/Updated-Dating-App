import {Component, OnInit} from '@angular/core';
import {User} from "../../../_models/user.interface";
import {AdminService} from "../../../_services/admin.service";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {RolesModalComponent} from "../../../_shared/modals/roles-modal/roles-modal.component";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: Partial<User[]> = [];
  bsModalRef: BsModalRef;

  constructor(
    private adminSv: AdminService,
    private modalSv: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminSv.getUsersWithRoles().subscribe(res => this.users = res);
  }

  openRolesModal(user: Partial<User>) {
    const config: ModalOptions = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalSv.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked == true).map(el => el.name)]
      };
      if (rolesToUpdate){
        this.adminSv.updateUserRoles(user.userName, rolesToUpdate.roles)
          .subscribe(() => user.roles = [...rolesToUpdate.roles])
      }
    })
  }

  private getRolesArray(user: Partial<User>) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'},
    ];

    availableRoles.forEach(ro => {
      let isMatch = false;
      for (const role of userRoles) {
        if (ro.name === role){
          isMatch = true;
          ro.checked = true;
          roles.push(ro);
          break;
        }
      }
      if (!isMatch){
        ro.checked = false;
        roles.push(ro)
      }
    })
    return roles;
  }
}
