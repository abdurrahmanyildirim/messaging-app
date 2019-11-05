import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat.component';
import { AuthService } from 'src/app/services/auth.service';
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
    private authService: AuthService
  ) {
    this.setRoomArray();
  }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.socket.emit('rooms', this.authService.getCurrentAccountId())
  }

  setRoomArray() {
    this.socket.on('rooms', datas => {
      this.rooms = datas.rooms;
    })
  }

  getChosenRoomMessages(roomId) {
    $('.btn').removeClass('active')
    $('#' + roomId).addClass('active')
    this.chatComponent.getChosenRoomMessages(roomId);
  }
}
