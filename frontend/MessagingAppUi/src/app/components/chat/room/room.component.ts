import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  rooms: Observable<Room[]>;

  constructor(
    private socket: Socket,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.setRoomArray();
  }

  getRooms() {
    this.socket.emit('rooms', null)

  }

  setRoomArray() {

    this.socket.on('rooms', datas => {
      console.log(datas);
      this.rooms = datas;
    })
  }
}
