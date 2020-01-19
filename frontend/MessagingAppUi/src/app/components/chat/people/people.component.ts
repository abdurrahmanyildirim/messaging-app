import { Component, OnInit, Injector } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { ActiveUser } from './model';
import { Observable } from 'rxjs';
import { ChatComponent } from '../chat.component';
declare var $: any;
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  activeUsers: Observable<ActiveUser[]>;
  currentId: string;

  constructor(private socket: Socket,
    private authService: AuthService,
    private injector: Injector) {

  }

  ngOnInit() {
    this.getActiveUsers();
    this.setActiveUserArray();
  }

  getActiveUsers() {
    this.currentId = this.authService.getCurrentAccountId();
    this.socket.emit('get activeUsers', null);
  }

  setActiveUserArray() {
    this.socket.on('visitors', data => {
      this.activeUsers = data;
      console.log(data);
    });
  }

  sendUserId(userId) {
    $('.person').removeClass('b-active');
    $('#' + userId).addClass('b-active');
    this.injector.get(ChatComponent).getChosenUserMessages(userId);
  }
}
