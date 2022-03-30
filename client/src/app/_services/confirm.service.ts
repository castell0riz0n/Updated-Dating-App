import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {ConfirmDialogComponent} from "../_shared/modals/confirm-dialog/confirm-dialog.component";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  basModalRef: BsModalRef

  constructor(private modalSv: BsModalService) {
  }

  confirm(title = 'Confirmation',
          message= 'Are you sure you want to do this?',
          btnOkText = 'Ok!',
          BtnCancelText = 'No I\'m not'): Observable<boolean> {

    const config: ModalOptions = {
      initialState: {
        title,
        message,
        btnOkText,
        BtnCancelText
      }
    }

    this.basModalRef = this.modalSv.show(ConfirmDialogComponent, config);

    return new Observable<boolean>(this.getResult());
  }

  private getResult() {
    return (observer) => {
      const subs = this.basModalRef.onHidden.subscribe(() => {
        observer.next(this.basModalRef.content.result);
        observer.complete();
      });
      return {
        unsubscribe() {
          subs.unsubscribe();
        }
      }
    }
  }
}
