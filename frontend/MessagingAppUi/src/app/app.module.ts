//Services
import { AlertifyService } from '../app/services/alertify.service';

//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io'

//Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { PeopleComponent } from './components/chat/people/people.component';
import { FriendComponent } from './components/chat/friend/friend.component';
import { RoomComponent } from './components/chat/room/room.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { RoomSettingComponent } from './components/admin-panel/room-setting/room-setting.component';
import { UserSettingComponent } from './components/admin-panel/user-setting/user-setting.component';
import { RoleGuard } from './guards/role.guard';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: { userid: 'asd' } };

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    AuthComponent,
    LoginComponent,
    ChatComponent,
    PeopleComponent,
    FriendComponent,
    RoomComponent,
    AdminPanelComponent,
    RoomSettingComponent,
    UserSettingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [
    AlertifyService,
    AuthService,
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
