import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Friend } from 'src/app/models/friend';
import { AuthService } from 'src/app/services/auth.service';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: Friend[];

  constructor(
    private socket: Socket,
    private authService: AuthService,
    private chatComponent: ChatComponent
  ) { }

  ngOnInit() {
    this.getFriends();
    this.setFriends();
  }

  getFriends() {
    this.socket.emit('friends', this.authService.getCurrentAccountId());
  }

  setFriends() {
    this.socket.on('friends', datas => {
      if (datas.userId == this.authService.getCurrentAccountId()) {
        this.friends = datas.friends;
      }
    })
  }

  sendUserId(userId) {
    this.chatComponent.getChosenUserMessages(userId);
  }

}
