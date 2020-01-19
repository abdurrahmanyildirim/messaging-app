import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
    selector: 'app-account-setting',
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
    viewProviders: [AccountService]
})
export class AccountSettingComponent {

    
}
