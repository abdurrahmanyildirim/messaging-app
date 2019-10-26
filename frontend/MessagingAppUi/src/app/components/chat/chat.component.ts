import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActiveUser } from 'src/app/models/activeUser';
import { Socket } from 'ng-socket-io';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  activeUsers:  ActiveUser[];

  constructor(
    private socket: Socket,
    private authService: AuthService
  ) {
    this.getMessage();
  }

  ngOnInit() {
    this.addActiveUser(this.authService.getCurrentAccountId());
  }

  message: string;

  sendMessage() {
    this.socket.emit("message", this.message);
  }

  getMessage() {
    this.socket.on("message", data => alert(data));
  }

  addActiveUser(id) {
    this.socket.emit('add activeUser', id);
  }

  // getActiveUsers() {
  //   this.socket.on("visitors", data => {
  //     this.activeUsers = data;
  //   })
  // }

}
