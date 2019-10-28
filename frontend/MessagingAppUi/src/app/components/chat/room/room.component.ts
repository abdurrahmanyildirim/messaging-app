import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms: Observable<Room[]>;

  constructor(
    private socket: Socket,
    private messageService: MessageService,
    private chatComponent: ChatComponent
  ) {
    this.setRoomArray();
  }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.socket.emit('rooms', null)
  }

  setRoomArray() {
    this.socket.on('rooms', datas => {
      this.rooms = datas;
    })
  }

  getChosenRoomMessages(roomId) {
    this.chatComponent.getChosenRoomMessages(roomId);
  }
}
