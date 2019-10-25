import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginUser: any = {};

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.createLoginForm()
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.loginUser = Object.assign({}, this.loginForm.value);
      this.authService.login(this.loginUser).subscribe(
        data => {
          this.authService.saveToken(data.token);
          this.alertifyService.success("Giriş yapıldı.")
          this.router.navigateByUrl('/countries');
        },
        err => {
          this.alertifyService.alert("Hatalı giriş! Lütfen tekrar deneyiniz.");
          this.loginForm.reset();
        }
      )
    }
  }

}
