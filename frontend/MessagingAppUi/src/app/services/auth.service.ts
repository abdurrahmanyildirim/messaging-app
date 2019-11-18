import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertifyService } from './alertify.service';
import { LoginUser } from '../models/loginUser';
import { RegisterUser } from '../models/registerUser';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private alertifyService: AlertifyService,
    private angularFireAuth: AngularFireAuth
  ) { }

  baseUrl: string = environment.path + 'auth/';
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = 'token';

  loginWithFireBase() {

  }

  registerWithFireBase(email: string, password: string) {
    this.angularFireAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed up!', res);
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });
  }

  login(loginUser: LoginUser): any {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient
      .post<any>(this.baseUrl + 'Login', loginUser, { headers: headers });
  }

  checkNickName(nickName: string) {
    return this.httpClient.get<any>(this.baseUrl + 'check-nick-name?nickName=' + nickName);
  }

  register(registerUser: RegisterUser): any {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient
      .post<any>(this.baseUrl + 'register', registerUser, { headers: headers });
  }

  get headers() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.alertifyService.error('Çıkış yapıldı.');
  }

  loggedIn() {
    return localStorage.getItem(this.TOKEN_KEY) ? true : false;
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentAccountRole() {
    return this.jwtHelper.decodeToken(this.token).role;
  }

  getCurrentAccountId() {
    return this.jwtHelper.decodeToken(this.token)._id;
  }
}
