import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AccountService {
    baseUrl = environment.path + 'account/';

    constructor(private http: HttpClient) {

    }

    upload(image: FormData) {
        return this.http.post(this.baseUrl + 'upload', image);
    }

}