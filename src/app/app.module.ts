import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageService } from 'src/services/storage.service';
import { FilesService } from 'src/services/files.service';
import { TokenInterceptor } from 'src/services/token-interceptor';
import { LoaderComponent } from './layouts/loader/loader.component';
import { LoaderController } from './layouts/loader/loader.controller';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    StorageService,
    FilesService,
    [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
    ],
    LoaderController
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
