import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { StorageService } from 'src/services/storage.service';
import { User } from 'src/models/user';
import { FilesService } from 'src/services/files.service';
import { IFile } from 'src/models/files';
import { LoaderController } from '../layouts/loader/loader.controller';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginData: {
    username?: string,
    password?: string,
  } = {};

  fileUpload: File = null;
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
      this.errorAlert(err.error.error);
    });
  }

  onFileChange(ev) {
    this.fileUpload = ev.target.files[0];
  }

  async editFile(file: IFile) {
    const {value: filelabel} = await Swal.fire({
      title: 'Escriba un nuevo nombre al archivo',
      input: 'text',
      inputValue: file.label,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'No puede dejar el nombre vacio';
        }
      }
    });

    if (filelabel) {
      this.filesServ.UpdateFile({id: file.id, label: filelabel}).then(file => {
        Swal.fire(`Archivo modificado con éxito`);
        const i = this.files.findIndex(f => f.id == file.id);
        if (i >= 0) {
          this.files[i].label = filelabel;
        }
      }, err => {
        this.errorAlert(err.error.error);
      });
    }
  }

  uploadFile() {
    if (!this.fileUpload) {return; } // Si no ah seleccionado ningun archivo sale

    this.loaderCtrl.show();

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
      this.loaderCtrl.hide();
      this.files.push(file);
      this.fileUpload = null;
      this.fileLabelUpload = '';
    }, err => {
      this.loaderCtrl.hide();
      this.errorAlert(err.error.error);
    });
  }

  downloadFile(file: IFile) {
    this.filesServ.DownloadFile({id: file.id, filename: file.filename});
  }

  login() {
    this.loaderCtrl.show();
    if (this.loginData.password && this.loginData.username) {
      this.authServ.LoginUser({username: this.loginData.username, password: this.loginData.password})
      .then((user) => {
        this.storage.setValue('token', user.token);
        this.user = user;
        this.loaderCtrl.hide();
      }, err => {
        this.errorAlert(err.error.error);
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

  confirmDeleteFile(file: IFile) {
    Swal.fire({
      title: 'Eliminar archivo',
      text: '¿Estás seguro que desea eliminar?',
      type: 'question',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
          return this.deleteFile(file)
          .then(data => {
            console.log(data);
          }).catch((err) => {
            Swal.fire({
              type: 'error',
              title: err.err.err
            });
          });
      }
    }).then((data) => {
      Swal.fire({
        title: 'Exito!',
        text: 'Archivo borrado con exito.',
        confirmButtonText: 'Aceptar',
        })
    });
  }

  deleteFile(file: IFile): Promise<any> {
    return this.filesServ.DeleteFile({id: file.id, filename: file.filename})
    .then(() => {
       this.files = this.files.filter(f => f !== file);
    });
  }

  errorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      type: 'error',
      confirmButtonText: 'Continuar'
    });
  }
}
