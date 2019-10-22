import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable()
export class AlertifyService {

    constructor() { }

    alert(message: string) {
        alertify
            .alert(message, function () {
                alertify.message('OK');
            }).setHeader('<b>Uyarı Mesajı</b> '); ;
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
