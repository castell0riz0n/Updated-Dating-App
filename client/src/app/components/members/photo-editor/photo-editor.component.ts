import {Component, Input, OnInit} from '@angular/core';
import {Member} from "../../../_models/member";
import {FileUploader} from "ng2-file-upload";
import {environment} from "../../../../environments/environment";
import {AccountService} from "../../../_services/account.service";
import {take} from "rxjs";
import {User} from "../../../_models/user.interface";
import {MembersService} from "../../../_services/members.service";
import {Photo} from "../../../_models/photo";

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;

  uploader: FileUploader;
  hasBaseDropZone = false;
  baseUrl = environment.baseUrl;
  private user: User;
  constructor(
    private accountSv: AccountService,
    private memberSv: MembersService
  ) {
    this.accountSv.currentUser$.pipe(take(1)).subscribe(usr => this.user = usr);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any){
    this.hasBaseDropZone = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 2024
    });

    this.uploader.onAfterAddingFile = (file) =>{
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem= (item, response, status,  headers) => {
      if (response){
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);
        if (photo.isMain){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountSv.setCurrentUser(this.user);
        }
      }
    }
  }

  setMainPhoto(photo){
    this.memberSv.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountSv.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photo){
    this.memberSv.deletePhoto(photo.id).subscribe(() => {
      this.member.photos = this.member.photos.filter(a => a.id !== photo.id)
    })
  }
}
