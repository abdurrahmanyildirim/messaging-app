import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService} from '@auth0/angular-jwt';
import { AlertifyService } from './alertify.service';


@Injectable()
export class AuthService {

    constructor(
        private httpClient: HttpClient,
        private alertifyService:AlertifyService
    ) { }

    baseUrl: string = environment.path + "/api/auth/";
    jwtHelper: JwtHelperService = new JwtHelperService();
    TOKEN_KEY = "token";
  
    login(loginUser: any): any {
      let headers = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json");
      return this.httpClient
        .post<any>(this.baseUrl + "Login", loginUser, { headers: headers });
    }
  
    register(registerUser: any): any {
      let headers = new HttpHeaders();
      headers = headers.append("Content-Type", "application/json");
      return this.httpClient
        .post<any>(this.baseUrl + "register", registerUser, { headers: headers });
    }
  
    get headers() {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token)
      headers = headers.append("Content-Type", "application/json");
      return headers;
    }
  
    saveToken(token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  
    logOut() {
      localStorage.removeItem(this.TOKEN_KEY);
      this.alertifyService.error("Çıkış yapıldı.")
    }
  
    loggedIn() {
      return this.jwtHelper.isTokenExpired(this.TOKEN_KEY);
    }
  
    get token() {
      return localStorage.getItem(this.TOKEN_KEY);
    }
  
    getCurrentAccountRole(){
      return this.jwtHelper.decodeToken(this.token).role;
    }
  
    getCurrentAccountId() {
      return this.jwtHelper.decodeToken(this.token).nameid
    }
}
