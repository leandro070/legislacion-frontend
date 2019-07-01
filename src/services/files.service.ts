import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IFile } from 'src/models/files';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  urlBase = environment.urlBase;

  constructor(private http: HttpClient) { }

  /**
   * ListFiles
   */
  public ListFiles(): Promise<IFile[]> {
    const url = this.urlBase + '/files';

    return this.http.get<IFile[]>(url).toPromise();
  }

  /**
   * DownloadFile descarga los archivos solicitados en el server
   */
  public DownloadFile(params: {id: number, filename: string}) {
    return new Promise((resolve, reject) => {
      const url = this.urlBase + '/download/' + params.id;

      this.http.get(url, {responseType: 'blob' as 'json'})
      .subscribe((response: Response) => {
        resolve()
        saveAs(response, params.filename);
      });
    });
  }

  /**
   * UploadFile
   */
  public UploadFile(fileFrom): Promise<IFile> {
    const url = this.urlBase + '/files';

    return this.http.post<IFile>(url, fileFrom).toPromise();
  }

  /**
   * DeleteFile elimina el archivo solicitado del server
   */
  public DeleteFile(params: {id: number, filename: string}): Promise<any> {
    const url = this.urlBase + '/files/' + params.id;

    return this.http.delete(url).toPromise();
  }

  public UpdateFile(params: {id: number, label: string}): Promise<IFile> {
    const url = this.urlBase + '/files/' + params.id;

    return this.http.put<IFile>(url, {label: params.label}).toPromise();
  }
}
