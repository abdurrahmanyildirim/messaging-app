import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Socket } from 'ng-socket-io';
import { MessageRoom } from 'src/app/models/messageRoom';
import { Observable } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { MessageUser } from 'src/app/models/messageUser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  roomMessages: Observable<MessageRoom[]>;
  userMessages: Observable<MessageUser>[];
  targetRoomId: string;
  targetUserId: string;
  message: string = '';

  constructor(
    private socket: Socket,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) { }

  ngOnInit() {
    this.addActiveUser(this.authService.getCurrentAccountId());
    this.setRoomMessages()
    this.setUserMessages();
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  addActiveUser(id) {
    this.socket.emit('add activeUser', id);
  }

  getChosenRoomMessages(roomId) {
    this.targetUserId = null;
    this.targetRoomId = roomId;
    this.userMessages = null;
    this.socket.emit('roomMessages', roomId, this.authService.getCurrentAccountId());
  }

  getChosenUserMessages(chosenUserId) {
    this.targetRoomId = null;
    this.targetUserId = chosenUserId;
    this.roomMessages = null;
    this.socket.emit('userMessages', chosenUserId, this.authService.getCurrentAccountId());
  }

  sendMessage() {
    if (this.message.length <= 0 || this.message == null) {
      this.alertifyService.alert('Boş mesaj gönderilemez!')
    } else if (this.targetRoomId != null) {
      this.socket.emit('message to room',
        {
          targetRoomId: this.targetRoomId,
          userId: this.authService.getCurrentAccountId(),
          message: this.message
        });
    } else if (this.targetUserId != null) {
      this.socket
        .emit('message to user',
          {
            targetUserId: this.targetUserId,
            sourceUserId: this.authService.getCurrentAccountId(),
            message: this.message
          });
    }
  }

  setUserMessages() {
    this.socket.on('userMessages', data => {
      if (this.authService.getCurrentAccountId() == data.userId) {
        this.userMessages = data.messages
      }
    })
  }

  setRoomMessages() {
    this.socket.on('roomMessages', data => {
      if (data.userId == this.authService.getCurrentAccountId()) {
        this.roomMessages = data.messages;
      }
    })
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
