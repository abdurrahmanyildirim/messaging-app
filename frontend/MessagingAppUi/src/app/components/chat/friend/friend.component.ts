import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Friend } from './model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatComponent } from '../chat.component';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: Friend[];

  constructor(private socket: Socket,
    private authService: AuthService,
    private chatComponent: ChatComponent,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.getFriends();
    this.setFriends();
  }

  getFriends() {
    this.socket.emit('friends', this.authService.getCurrentAccountId());
  }

  setFriends() {
    this.socket.on('friends', async datas => {
      const friends = await datas.friends.sort((a, b) => new Date(b.lastMesssageDate).getTime() - new Date(a.lastMesssageDate).getTime());
      this.friends = friends;
    });
  }

  sendUserId(userId) {
    this.friends.map(friend => {
      if (friend.userId === userId) {
        friend.nonReadMessageCount = 0;
      }
    });
    this.cdr.detectChanges();
    $('.person').removeClass('b-active');
    $('#' + userId).addClass('b-active');
    this.chatComponent.getChosenUserMessages(userId);
  }

}
