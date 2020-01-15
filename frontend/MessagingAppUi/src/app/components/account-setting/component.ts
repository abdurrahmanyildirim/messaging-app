import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
    selector: 'app-account-setting',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    viewProviders: [AccountService]
})
export class AccountSettingComponent {

    selectedPhoto: File = null;

    constructor(private accountService: AccountService) {

    }

    onChange(event: any) {
        this.selectedPhoto = <File>event.target.files[0];
        console.log(this.selectedPhoto);
    }

    uploadPhoto() {
        const fd = new FormData();
        fd.append('image', this.selectedPhoto, this.selectedPhoto.name);
        this.accountService.upload(fd).subscribe();
    }


}
