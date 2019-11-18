import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable()
export class AlertifyService {

    constructor() { }

    alert(message: string) {
        alertify.alert('Uyarı Mesajı', message);
    }

    success(message: string) {
        alertify.success(message);
    }
    warning(message: string) {
        alertify.warning(message);
    }
    error(message: string) {
        alertify.error(message);
    }

}
