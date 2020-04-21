import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../models/file.model';
import { Observable } from 'rxjs';
import { GRAPHCOOL_CONFIG, GraphcoolConfig } from '../providers/graphcool-config.provider';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    @Inject(GRAPHCOOL_CONFIG) private graphcoolConfig: GraphcoolConfig,
    private http: HttpClient
  ) { }

  upload(file: File): Observable<FileModel> {
    const formData = new FormData();
    formData.append('data', file);
    return this.http.post<FileModel>(this.graphcoolConfig.fileAPI, formData);
  }
}
