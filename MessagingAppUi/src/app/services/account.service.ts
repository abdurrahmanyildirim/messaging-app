import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../components/account-setting/photo/model';

@Injectable()
export class AccountService {
    baseUrl = environment.path + 'account/';

    constructor(private http: HttpClient) {

    }

    upload(image: FormData): Observable<HttpEvent<Photo>> {
        return this.http.post<Photo>(this.baseUrl + 'upload', image, { reportProgress: true, observe: 'events' });
    }

    getPhoto(): Observable<Photo> {
        return this.http.get<Photo>(this.baseUrl + 'photo')
    }

    changePassword(newPassword): Observable<any> {
        return this.http.post(this.baseUrl + 'change-password', newPassword);
    }

}
