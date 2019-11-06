import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Friend } from 'src/app/models/friend';
import { AuthService } from 'src/app/services/auth.service';
import { ChatComponent } from '../chat.component';
declare var $: any;
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
      let friends = datas.friends.sort((a, b) => new Date(b.lastMesssageDate).getTime() - new Date(a.lastMesssageDate).getTime());
      this.friends = friends;
    })
  }

  sendUserId(userId) {
    $('#' + userId + '-badge').html('');
    $('.btn-friends').removeClass('active')
    $('#' + userId).addClass('active')
    this.chatComponent.getChosenUserMessages(userId);
  }

}
