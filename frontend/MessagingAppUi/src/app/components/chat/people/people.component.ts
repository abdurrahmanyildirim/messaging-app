import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { ActiveUser } from 'src/app/models/activeUser';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  activeUsers: Observable<ActiveUser[]>;
  currentId:string;
  constructor(
    private socket: Socket,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getActiveUsers();
    this.setActiveUserArray();
  }

  getActiveUsers() {
    this.currentId=this.authService.getCurrentAccountId();
    this.socket.emit("get activeUsers", null)
  }

  setActiveUserArray() {
    this.socket.on("visitors", data => {
      this.activeUsers = data;
    })
  }



}
