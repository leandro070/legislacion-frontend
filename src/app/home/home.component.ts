import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { StorageService } from 'src/services/storage.service';
import { User } from 'src/models/user';
import { FilesService } from 'src/services/files.service';
import { IFile } from 'src/models/files';
import { LoaderController } from '../layouts/loader/loader.controller';

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

  fileUpload: File;
  fileLabelUpload = '';

  user: User;
  files: IFile[];

  constructor(
    private authServ: AuthenticationService,
    private storage: StorageService,
    private filesServ: FilesService,
    private loaderCtrl: LoaderController
    ) { }

  ngOnInit() {
    this.listFiles();
    this.validateToken();
  }

  validateToken() {
    this.loaderCtrl.show();
    this.authServ.ValidateToken().then((user) => {
      this.loaderCtrl.hide();
      this.user = user;
    }).catch((err) => {
      this.loaderCtrl.hide();
      console.log('usuario no logueado', err);
    });
  }

  listFiles() {
    this.filesServ.ListFiles().then(data => {
      this.files = data;
    }, err => {
      console.error(err);
    });
  }

  onFileChange(ev) {
    this.fileUpload = ev.target.files[0];
  }

  uploadFile() {
    if (this.fileUpload === null) {return; }

    if (this.fileLabelUpload === '') { // En caso de no haber ingresado ningun nombre al archivo, tomara el nombre que ya posee
      const index = this.fileUpload.name.lastIndexOf('.'); // index tiene el indice en donde aparece un '.' en el nombre del archivo
      if (index !== -1) {
        this.fileLabelUpload = this.fileUpload.name.substr(0, index);
      } else {
        this.fileLabelUpload = this.fileUpload.name.substr(0);
      }
    }
    const formData = new FormData();
    formData.append('file', this.fileUpload);
    formData.append('label', this.fileLabelUpload);

    this.filesServ.UploadFile(formData)
    .then(file => {
      this.files.push(file);
      this.fileUpload = null;
      this.fileLabelUpload = '';
    });
  }

  downloadFile(file: IFile) {
    this.filesServ.DownloadFile({id: file.id, filename: file.filename});
  }

  login() {
    this.loaderCtrl.show();
    if (this.loginData.password && this.loginData.username) {
      this.loginData.loading = true;
      this.authServ.LoginUser({username: this.loginData.username, password: this.loginData.password})
      .then((user) => {
        this.storage.setValue('token', user.token);
        this.user = user;
        this.loginData.loading = false;
        this.loaderCtrl.hide();
      }, err => {
        this.loginData.loading = false;
        console.error(err);
        this.loaderCtrl.hide();
      });
    }
  }

  logout() {
    if (this.user) {
      this.authServ.LogoutUser();
      this.user = null;
    }
  }

  deleteFile(file: IFile) {
    this.filesServ.DeleteFile({id: file.id, filename: file.filename})
    .then( () => {
       this.files = this.files.filter(f => f !== file);
      });
  }
}
