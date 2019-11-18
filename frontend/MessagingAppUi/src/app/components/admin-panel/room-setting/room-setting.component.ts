import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { SettingService } from 'src/app/services/setting.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { Room } from 'src/app/models/room';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-room-setting',
  templateUrl: './room-setting.component.html',
  styleUrls: ['./room-setting.component.css']
})
export class RoomSettingComponent implements OnInit {

  roomGroup: FormGroup;
  room: any = {};
  rooms: Observable<Room[]>;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.createRoomForm();
  }

  createRoomForm() {
    this.roomGroup = this.fb.group({
      roomName: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      createdDate: new FormControl(Date.now())
    });
    this.getRooms();
  }

  addRoom() {
    if (this.roomGroup.valid) {
      this.room = Object.assign({}, this.roomGroup.value);
      this.settingService.addRoom(this.room).subscribe(
        data => {
          this.alertifyService.success('Yeni oda eklendi.');
          this.roomGroup.reset();
          this.getRooms();
        },
        err => {
          this.alertifyService.alert(err.message);
          this.roomGroup.reset();
        }
      );
    }
  }

  getRooms() {
    this.settingService.getRooms().subscribe(data => {
      this.rooms = data as any;
    });
  }

  deleteRoom(roomId) {
    this.settingService.deleteRoom(roomId).subscribe(data => {
      this.alertifyService.success('Oda Silindi.');
      this.getRooms();
    },
      err => {
        this.alertifyService.error('Bir hata meydana geldi.');
      });
  }

}
