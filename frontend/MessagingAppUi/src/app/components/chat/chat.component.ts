import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Socket } from 'ng-socket-io';
import { MessageRoom } from 'src/app/models/messageRoom';
import { Observable } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { MessageUser } from 'src/app/models/messageUser';
import { Router } from '@angular/router';

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
  message: string = '';

  constructor(
    private socket: Socket,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private router: Router
  ) { }

  ngOnInit() {
    this.addActiveUser(this.authService.getCurrentAccountId());
    this.receivedMessage();
    this.receiveRoomMessage();
    this.setRoomMessages();
    this.setUserMessages();
  }
  
  ngAfterViewInit() {
    this.messages.changes.subscribe(this.scrollToBottom);
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
      this.roomMessages.push(data)
    })
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
      var currentId = this.authService.getCurrentAccountId();
      var isFrom = currentId == data.sourceId ? true : false;
      var message: any = {
        content: data.message,
        sendDate: Date.now(),
        isFrom: isFrom
      }

      this.userMessages.push(message);

      // if (currentId == data.sourceId) {

      //   var message: any = {
      //     content: data.message,
      //     sendDate: Date.now(),
      //     isFrom: true
      //   }
      //   this.userMessages.push(message);
      // }

      // if (currentId == data.targetId) {
      //   var message: any = {
      //     content: data.message,
      //     sendDate: Date.now(),
      //     isFrom: false
      //   }
      //   this.userMessages.push(message);
      // }
    })
  }

  sendMessage() {
    if (this.message.length <= 0 || this.message == null) {
      this.alertifyService.alert('Boş mesaj gönderilemez!')
    } else if (this.targetRoomId != null) {
      this.sendRoomMessage();
      this.message = '';
    } else if (this.targetUserId != null) {
      this.sendUserMessage();
      this.message = '';
    }
  }

  setUserMessages() {
    this.socket.on('userMessages', data => {
      this.userMessages = data.messages
    })
  }

  setRoomMessages() {
    this.socket.on('roomMessages', data => {
      this.roomMessages = data.messages;
    })
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) { }
  }

  logOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/auth/login')
  }

}
