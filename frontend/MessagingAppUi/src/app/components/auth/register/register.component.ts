import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  registerUser: any = {};
  nickNameModel: any;
  nickNameValidationMessage: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.maxLength(60), Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      confirmPassword: new FormControl("", Validators.required),
      firstName: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl("", [Validators.required, Validators.maxLength(50)]),
      nickName: new FormControl("", [Validators.required, Validators.maxLength(40)])
    }, { validator: this.matchingFields('password', 'confirmPassword') }
    )
  }

  register() {
    if (this.registerForm.valid) {
      this.registerUser = Object.assign({}, this.registerForm.value);
      this.authService.register(this.registerUser)
        .subscribe(data => {
          this.alertifyService.success("Üyelik işlemi başarılı. Giriş yapabilirsiniz.")
          this.router.navigateByUrl('/auth/login');
        },
          err => {
            this.alertifyService.error(err.message);
            console.log(err);
            this.registerForm.reset();
          });
    }
  }

  matchingFields(field1, field2) {
    return form => {
      if (form.controls[field1].value !== form.controls[field2].value)
        return { matchingFields: true }
    }
  }

  checkNickName(nickName) {
    this.authService.checkNickName(nickName)
      .subscribe(
        data => {
          this.registerForm.patchValue({
            nickName: nickName
          })
          this.nickNameValidationMessage = null;
        },
        err => {
          this.registerForm.patchValue({
            nickName: null
          })
          this.nickNameValidationMessage = '*Bu kullanıcı adını başka bir kişi kullanmaktadır.'
        }
      )
  }
}
