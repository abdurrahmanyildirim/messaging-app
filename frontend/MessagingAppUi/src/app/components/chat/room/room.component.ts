import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat.component';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';
declare var $: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms: Observable<Room[]>;
  constructor(
    private socket: Socket,
    private chatComponent: ChatComponent,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {
    this.setRoomArray();
  }

  ngOnInit() {
    this.getRooms();
    this.userJoinToRoom();
    this.userLeftFromRoom();
  }

  getRooms() {
    this.socket.emit('rooms', this.authService.getCurrentAccountId());
  }

  setRoomArray() {
    this.socket.on('rooms', datas => {
      this.rooms = datas.rooms;
    });
  }

  userJoinToRoom() {
    this.socket.on('user joined to room', data => {
      this.alertifyService.success(data + ' odaya katıldı.');
    });
  }

  userLeftFromRoom() {
    this.socket.on('user left from room', data => {
      this.alertifyService.error(data + ' odadan ayrıldı.');
    });
  }

  getChosenRoomMessages(roomId) {
    $('.btn-rooms').removeClass('active');
    $('#' + roomId).addClass('active');
    this.chatComponent.getChosenRoomMessages(roomId);
  }
}
