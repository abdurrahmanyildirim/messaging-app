import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService} from '../../services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  registerUser:any={};

  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private alertifyService:AlertifyService,
    private router:Router
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      email: ["", [Validators.required, Validators.maxLength(60)]],
      password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      confirmPassword: ["", Validators.required],
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      birthDate: ["", Validators.required]
    },
      { validator: this.matchingFields('password', 'confirmPassword') }
    )
  }

  register() {
    if (this.registerForm.valid) {
      this.registerUser = Object.assign({}, this.registerForm.value);
      this.authService.register(this.registerUser)
      .subscribe(data => {
        this.alertifyService.success("Üyelik işlemi başarılı. Giriş yapabilirsiniz.")
        this.router.navigateByUrl('/login');
      },
      err=>{
        this.alertifyService.error(err.error);
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


}
