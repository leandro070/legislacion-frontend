import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { File } from 'src/models/files';
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
  public ListFiles(): Promise<File[]> {
    const url = this.urlBase + '/files';

    return this.http.get<File[]>(url).toPromise();
  }

  /**
   * DownloadFile descarga los archivos solicitados en el server
   */
  public DownloadFile(params: {id: number, filename: string}) {
    const url = this.urlBase + '/download/' + params.id;

    return this.http.get(url, {responseType: 'blob' as 'json'})
    .subscribe((response: Response) => {
      saveAs(response, params.filename);
    });
  }

  /**
   * DeleteFile elimina el archivo solicitado del server
   */
  public DeleteFile(params: {id: number, filename: string}) {
    const url = this.urlBase + '/files/' + params.id;

    return this.http.delete(url).subscribe();
  }
}
