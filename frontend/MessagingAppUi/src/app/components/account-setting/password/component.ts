import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
    selector: 'app-password',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class PasswordComponent {

    password = '';
    confirmPassword = '';

    errPassword = 'default';
    errConfirmPassword = 'default';

    change = true;

    constructor(private accountService: AccountService,
        private alertifyService: AlertifyService) {

    }
    // TODO: Form'a çevirilecek
    changePassword() {
        this.accountService.changePassword(this.password).subscribe(
            success => {
                this.alertifyService.success('Şifre değiştirildi.')
                this.password = this.confirmPassword = '';
                this.errPassword = this.errConfirmPassword = 'default';
            },
            err => {
                this.alertifyService.success('Şifre değiştirirken bir hata oldu.')
                this.password = this.confirmPassword = '';
                this.errPassword = this.errConfirmPassword = 'default';
            }
        )
    }

    checkPassword(event: any) {
        this.password = event.target.value;
        if (this.password.length < 3) {
            this.errPassword = 'Şifre 3 karakterden az olamaz.';
            this.change = true;
        } else {
            this.errPassword = 'default';
        }

        if (this.errConfirmPassword == 'default' && this.errConfirmPassword == 'default') {
            this.change = false;
        }
    }

    checkConfirmPassword(event: any) {
        this.confirmPassword = event.target.value;
        if (this.password !== this.confirmPassword) {
            this.errConfirmPassword = 'Şifreler uyuşmuyor.';
            this.change = true;
        } else {
            this.errConfirmPassword = 'default';
        }

        if (this.errConfirmPassword == 'default' && this.errConfirmPassword == 'default') {
            this.change = false;
        }
    }
}
