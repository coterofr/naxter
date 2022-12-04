import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: 'posts/home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'posts',
    loadChildren: () => import('./post/post.module').then((m) => m.PostModule),
  },
  {
    path: 'themes',
    loadChildren: () => import('./theme/theme.module').then((m) => m.ThemeModule),
  },
  {
    path: 'profiles',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  { path: '**', redirectTo: 'posts/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
