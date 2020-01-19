import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { Photo } from './model';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'app-photo',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class PhotoComponent {

    selectedPhoto: File;
    newPhoto: any;
    currentPhoto: Photo;
    showProgress: boolean = false;

    constructor(private accountService: AccountService,
        private alertifyService: AlertifyService) {
        this.getPhoto();
    }

    onChange(event: any) {
        if (event.target.files[0]) {
            this.selectedPhoto = <File>event.target.files[0];
            const reader = new FileReader();
            reader.onload = e => this.newPhoto = reader.result;
            reader.readAsDataURL(this.selectedPhoto);
        }
    }

    uploadPhoto() {
        if (!this.selectedPhoto) {
            this.alertifyService.error('Bir fotoğraf seçiniz.');
            return;
        }
        const fd = new FormData();
        fd.append('image', this.selectedPhoto, this.selectedPhoto.name);
        this.accountService.upload(fd).subscribe(
            (event) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.showProgress = true;
                } else if (event.type === HttpEventType.Response) {
                    this.showProgress = false;
                    this.alertifyService.success('Fotoğraf değiştirldi.');
                    this.currentPhoto.url = event.body.url;
                    this.newPhoto = this.selectedPhoto = null;
                }
            },
            err => {
                console.log(err);
                this.alertifyService.error('Bir hata meydana geldi. Tekrar deneyiniz.');
                this.newPhoto = this.selectedPhoto = null;
            }
        );
    }

    getPhoto() {
        this.accountService.getPhoto().subscribe(photo => {
            this.currentPhoto = photo
        })
    }
}