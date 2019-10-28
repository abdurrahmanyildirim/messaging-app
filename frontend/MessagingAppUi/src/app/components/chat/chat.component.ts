import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Socket } from 'ng-socket-io';
import { MessageRoom } from 'src/app/models/messageRoom';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  roomMessages: Observable<MessageRoom[]>;

  constructor(
    private socket: Socket,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.addActiveUser(this.authService.getCurrentAccountId());
    this.setRoomMessages()
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  addActiveUser(id) {
    this.socket.emit('add activeUser', id);
  }

  getChosenRoomMessages(roomId) {
    this.socket.emit('roomMessages', roomId);
  }

  setRoomMessages() {
    this.socket.on('roomMessages', data => {
      this.roomMessages = data;
    })
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
