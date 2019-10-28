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
