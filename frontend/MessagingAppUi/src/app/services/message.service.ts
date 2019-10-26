import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../models/room';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  baseUrl = environment.path;

  getRooms(): Observable<Observable<Room[]>> {
    return this.http.get<Observable<Room[]>>(this.baseUrl + "rooms");
  }

}
