import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { ChatModule } from './chat/chat.module';
import { MerchandisingModule } from './merchandising/merchandising.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './shared/utils/translate-api';
import { ThemeModule } from './theme/theme.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AuthModule,
    PostModule,
    ThemeModule,
    ProfileModule,
    UserModule,
    ChatModule,
    MerchandisingModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
