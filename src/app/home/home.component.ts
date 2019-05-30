import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { StorageService } from 'src/services/storage.service';
import { User } from 'src/models/user';
import { userInfo } from 'os';
import { FilesService } from 'src/services/files.service';
import { File } from 'src/models/files';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginData: {
    username?: string,
    password?: string,
    loading?: boolean
  } = {};

  user: User;
  files: File[];

  constructor(
    private authServ: AuthenticationService,
    private storage: StorageService,
    private filesServ: FilesService
    ) { }

  ngOnInit() {
    this.listFiles();
  }

  listFiles() {
    this.filesServ.ListFiles().then((data) => {
      this.files = data;
    }, err => {
      console.error(err);
    });
  }

  downloadFile(file: File) {
    this.filesServ.DownloadFile({id: file.id, filename: file.filename});
  }

  login() {
    if (this.loginData.password && this.loginData.username) {
      this.loginData.loading = true;
      this.authServ.LoginUser({username: this.loginData.username, password: this.loginData.password})
      .then((user) => {
        this.storage.setValue('token', user.token);
        this.user = user;
        this.loginData.loading = false;
      }, err => {
        this.loginData.loading = false;
        console.error(err);
      });
    }
  }

  logout() {
    if (this.user) {
      this.authServ.LogoutUser();
      this.user = null;
    }
  }
}
