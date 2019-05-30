import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { StorageService } from 'src/services/storage.service';
import { FilesService } from 'src/services/files.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    StorageService,
    FilesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
