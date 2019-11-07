import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  constructor(
    private settingService: SettingService
  ) { }

  users: User[];

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.settingService.getUsers().subscribe(data => {
      this.users = data;
    })
  }

}
