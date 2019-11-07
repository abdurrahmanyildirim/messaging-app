import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl: string = environment.path + "setting/";

  addRoom(room: Room) {
    return this.http.post(this.baseUrl + '/create-room', room)
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl + 'get-rooms');
  }

  deleteRoom(roomdId) {
    return this.http.get(this.baseUrl + 'delete-room/' + roomdId)
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'get-users');
  }
}
