import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Room } from '../components/chat/room/model';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable()
export class SettingService {

  baseUrl: string = environment.path + 'setting/';

  constructor(
    private http: HttpClient
  ) { }

  addRoom(room: Room) {
    return this.http.post(this.baseUrl + '/create-room', room);
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl + 'get-rooms');
  }

  deleteRoom(roomdId) {
    return this.http.get(this.baseUrl + 'delete-room/' + roomdId);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'get-users');
  }
}
