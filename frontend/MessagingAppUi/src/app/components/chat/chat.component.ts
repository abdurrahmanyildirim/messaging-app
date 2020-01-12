import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Socket } from 'ng-socket-io';
import { MessageRoom } from 'src/app/models/messageRoom';
import { Observable } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { MessageUser } from 'src/app/models/messageUser';
import { Router } from '@angular/router';
import { RoleGuard } from 'src/app/guards/role.guard';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  roomMessages: Observable<MessageRoom>[];
  userMessages: Observable<MessageUser>[];
  targetRoomId: string;
  targetUserId: string;
  message = '';

  constructor(
    private socket: Socket,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getRole();
    this.addActiveUser(this.authService.getCurrentAccountId());
    this.receivedMessage();
    this.receiveRoomMessage();
    this.setRoomMessages();
    this.setUserMessages();
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  getRole() {
    if (this.authService.getCurrentAccountRole() === 'Admin') {
      return true;
    } else {
      return false;
    }
  }

  restValues() {
    this.targetRoomId = '';
    this.targetUserId = '';
    this.roomMessages = null;
    this.userMessages = null;
  }

  addActiveUser(id) {
    this.socket.emit('add activeUser', id);
  }

  getChosenRoomMessages(roomId) {
    if (this.targetRoomId != null) {
      this.socket.emit('leave room', this.targetRoomId);
    }

    this.socket.emit('join room', roomId);

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

  sendRoomMessage() {
    this.socket.emit('message to room',
      {
        targetRoomId: this.targetRoomId,
        userId: this.authService.getCurrentAccountId(),
        message: this.message
      });
  }

  receiveRoomMessage() {
    this.socket.on('message to room', data => {
      console.log(data);
      this.roomMessages.push(data);
    });
  }

  sendUserMessage() {
    this.socket
      .emit('message to user',
        {
          targetUserId: this.targetUserId,
          sourceUserId: this.authService.getCurrentAccountId(),
          message: this.message
        });
  }

  receivedMessage() {
    this.socket.on('message to user', data => {
      const currentId = this.authService.getCurrentAccountId();
      const isFrom = currentId === data.sourceId ? true : false;
      const message: any = {
        content: data.message,
        sendDate: Date.now(),
        isFrom: isFrom
      };
      if (data.sourceId === currentId) {
        this.userMessages.push(message);
      }
      if (data.targetId === currentId && data.sourceId === this.targetUserId) {
        this.userMessages.push(message);
        this.socket.emit('change isRead', data.sourceId, currentId);
      } else if (data.targetId === currentId) {
        this.socket.emit('friends', currentId);
      }
    });
  }

  sendMessage() {
    if (this.message.length <= 0 || this.message == null) {
      this.alertifyService.alert('Boş mesaj gönderilemez!');
    } else if (this.targetRoomId != null) {
      this.sendRoomMessage();
      this.message = '';
    } else if (this.targetUserId != null) {
      this.sendUserMessage();
      this.message = '';
    } else {
      this.alertifyService.alert('Bir mesaj hedefi seçiniz!');
    }
  }

  setUserMessages() {
    this.socket.on('userMessages', data => {
      this.userMessages = data.messages;
      this.socket.emit('change isRead', this.targetUserId, this.authService.getCurrentAccountId());
    });
  }

  setRoomMessages() {
    this.socket.on('roomMessages', data => {
      this.roomMessages = data.messages;
    });
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/auth/login');
  }

}
