import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { ActiveUser } from 'src/app/models/activeUser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  activeUsers: Observable<ActiveUser[]>;

  constructor(
    private socket: Socket,
    private authService: AuthService
  ) {
    this.getActiveUsers();
    console.log(this.activeUsers);
  }

  ngOnInit() {

  }

  getActiveUsers() {
    this.socket.on("visitors", data => {
      this.activeUsers = data;
    })
  }

}
