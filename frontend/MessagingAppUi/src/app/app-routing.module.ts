import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { PeopleComponent } from './components/chat/people/people.component';
import { RoomComponent } from './components/chat/room/room.component';
import { FriendComponent } from './components/chat/friend/friend.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { RoomSettingComponent } from './components/admin-panel/room-setting/room-setting.component';
import { UserSettingComponent } from './components/admin-panel/user-setting/user-setting.component';
import { RoleGuard } from './guards/role.guard';
import { AccountSettingComponent } from './components/account-setting/component';
import { PhotoComponent } from './components/account-setting/photo/component';
import { PasswordComponent } from './components/account-setting/password/component';

const routes: Routes = [
  {
    path: '', redirectTo: 'chat', pathMatch: 'full'
  }
  ,
  {
    path: 'auth', component: AuthComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: 'chat', component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'people', component: PeopleComponent },
      { path: 'rooms', component: RoomComponent },
      { path: 'friends', component: FriendComponent }
    ]
  },
  {
    path: 'admin-panel', component: AdminPanelComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: 'room-setting', component: RoomSettingComponent },
      { path: 'user-setting', component: UserSettingComponent }
    ]
  },
  {
    path: 'account-setting', component: AccountSettingComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'photo', component: PhotoComponent },
      { path: 'password', component: PasswordComponent }
    ]
  },
  {
    path: '**', redirectTo: 'chat', pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ]
})
export class AppRoutingModule { }
