import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { ActiveUser } from '../models/activeUser';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket,
    private authService: AuthService
  ) { }

  // sendMessage(message: string) {
  //   this.socket.emit("message", message);
  // }

  // getMessage() {
  //   this.socket.on("message", data => alert(data));
  // }

  // addActiveUser(id) {
  //   this.socket.emit('add activeUser', id);
  // }
  // activeUsers: ActiveUser[];
  // getActiveUsers(): ActiveUser[] {
  //   this.socket.on("visitors", data => {
  //     this.activeUsers = data;

  //   }).then((err)=>{
  //     return this.activeUsers;
  //   })
    
  // }



  // deleteActiveUsers() {
  //   this.socket.emit('disconnect')
  // }

  // updateActiveUsers() {
  //   this.socket.on('update activeUsers', function () {
  //     this.socket.emit('add activeUser', this.authService.getCurrentAccountId())
  //   })
  // }

}
