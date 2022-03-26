import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() registerEvent = new EventEmitter<boolean>();
  registerForm: FormGroup;
  maxDate:Date;
  validationErrors: string[];

  constructor(private accountSv: AccountService,
              private router: Router,
              private toastr: ToastrService,
              private fb: FormBuilder) {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnInit(): void {

  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    // this.registerForm.controls.password.valueChanges.subscribe(() => {
    //   this.registerForm.controls.confirmPassword.updateValueAndValidity();
    // })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control:AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {isMatching: true}
    }
  }

  register() {
    this.accountSv.register(this.registerForm.value).subscribe(res => {
      this.cancel();
    }, error => {
      this.validationErrors = error;
    });
  }

  cancel() {
    this.registerEvent.emit(false)
  }
}
