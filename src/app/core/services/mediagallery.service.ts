import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrandInfo } from '../models/viewmodel/BrandInfo';
import { APICustomMessage, IApiResponseArray, IApiResponseMessage } from '../models/viewmodel/IApiResponse';
import { MediaContent, MediaContentResponse } from '../models/viewmodel/mediaContent';
import { UGCBrandMentionInformation, UGCBrandMentionResponse } from '../models/viewmodel/UGCBrandMentionInformation';
import { UgcMention } from '../models/viewmodel/UgcMention';

@Injectable({
  providedIn: 'root'
})
export class MediagalleryService {

  LoadMediaGallery = new BehaviorSubject<boolean>(false);
  currentUGC: UgcMention;
  UGCMentionList: UgcMention[];
  selectedMedia: UgcMention[] = [];
  constructor(private _http: HttpClient,
              private _snackBar: MatSnackBar) { }

  EmitStarChangeEvent = new BehaviorSubject<object>({});
  EmitPillsChanged = new BehaviorSubject<object>({});

  emitStarChangeEvent(event): void{
     this.EmitStarChangeEvent.next(event);
  }

  emitPillsChanged(event): void{
    this.EmitPillsChanged.next(event);
  }


  GetMediaList(keyObj): Observable<UGCBrandMentionInformation>
  {
    // const customapiurl = 'http://aaf5c8e9dc1a.in.ngrok.io/api'
    return  this._http.post<UGCBrandMentionResponse>(environment.baseUrl + '/Tickets/MediaList', keyObj).pipe(
      map(response => {
          if (response.success)
          {
            this.UGCMentionList = response.data.lstUGCMention;
            return response.data;
          }
      })
    );

  }
  uploadFilesToServer(uploadedFiles: any, brandObj: any): Observable<MediaContent[]>{

    const formData: FormData  = new FormData();
    formData.append( 'brandInfo', JSON.stringify(brandObj) );
    for (const [index, file] of uploadedFiles.entries())
    {
      formData.append( `media[${index}]`, file);
      // this.readFile(this.files[0]).then(fileContents => {
      //   // Put this string in a request body to upload it to an API.
      //   console.log(fileContents);
      // const csv: string = typeof csv === 'string' ? csv : Buffer.from(csv).toString()
      // }
    }
    // const customapiurl = 'http://aaf5c8e9dc1a.in.ngrok.io/api'
    return  this._http.post<MediaContentResponse>(environment.baseUrl + '/Tickets/UploadMediaList', formData).pipe(
      map(response => {
          if (response.success)
          {
            return response.data;
          }else
          {
            this._snackBar.open(`${response.message}`, 'Ok', {
              duration: 1000
            });
          }
      })
    );
  }

  saveFilesToServer(keyObj): Observable<APICustomMessage>
  {
    // const customapiurl = 'http://aaf5c8e9dc1a.in.ngrok.io/api'

    return  this._http.post<IApiResponseMessage>(environment.baseUrl + '/Tickets/SaveUploadedMediaList', keyObj).pipe(
      map(response => {
          if (response.success)
          {
            return response.data;
          }
          else
          {
            this._snackBar.open(`${response.message}`, 'Ok', {
              duration: 1000
            });
          }
      })
    );

  }

  updateFileToServer(keyObj): Observable<APICustomMessage>
  {
    // const customapiurl = 'http://aaf5c8e9dc1a.in.ngrok.io/api'

    return  this._http.post<IApiResponseMessage>(environment.baseUrl + '/Tickets/UpdateMediaDetail', keyObj).pipe(
      map(response => {
          if (response.success)
          {
            return response.data;
          }
          else
          {
            this._snackBar.open(`${response.message}`, 'Ok', {
              duration: 1000
            });
          }
      })
    );

  }

  cancelSaving(): Observable<object>
  {
    // const customapiurl = 'http://aaf5c8e9dc1a.in.ngrok.io/api'

    return  this._http.post(environment.baseUrl + '/Tickets/CancelUploadedMediaList', {}).pipe(
      map(response => {
        console.log('cancel response', response);
        return response;
      })
    );

  }


  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  public emptySelectedMedia(): void{
    this.selectedMedia = [];
  }
}
