import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Friend } from 'src/app/models/friend';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: Friend[];

  constructor(
    private socket: Socket,
    private authService:AuthService
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
      console.log(datas);
      this.friends = datas;
    })
  }

}
