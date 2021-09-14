import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { MediaGalleryParameters } from 'app/core/models/viewmodel/MediaGalleryParameters';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { GenericRequestParameters } from 'app/core/models/viewmodel/GenericRequestParameters';
import { MediaGalleryFilter } from 'app/core/models/viewmodel/MediaGalleryFilter';
import { MediagalleryService } from 'app/core/services/mediagallery.service';
import { MediaContent } from 'app/core/models/viewmodel/mediaContent';
import { SaveMediaListParameters } from 'app/core/models/viewmodel/SaveMediaListParameters';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-media-dropzone',
  templateUrl: './media-dropzone.component.html',
  styleUrls: ['./media-dropzone.component.scss'],
  animations: locobuzzAnimations,
})
export class MediaDropzoneComponent implements OnInit, OnDestroy {
  constructor(
    private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private _mediaGalleryService: MediagalleryService,
    public dialogRef: MatDialogRef<MediaDropzoneComponent>,
    private _snackBar: MatSnackBar
  ) {}

  isImageDropped: boolean;
  filesUploaded: any[] = [];
  mediaContent: MediaContent[];
  ngOnInit(): void {
    this.subscribetoDropzoneEvent();
  }
  subscribetoDropzoneEvent(): void {
    this._mediaGalleryService.EmitStarChangeEvent.subscribe((event) => {
      if (event) {
        const obj = JSON.parse(JSON.stringify(event));
        if (obj.value) {
          this.starAffect(obj);
        }
      }
    });

    this._mediaGalleryService.EmitPillsChanged.subscribe((event) => {
      if (event) {
        const obj = JSON.parse(JSON.stringify(event));
        if (obj.pillvalue) {
          this.onPillsChanged(obj);
        }
      }
    });
  }

  onPillsChanged(event): void {
    if (this.mediaContent && this.mediaContent.length > 0) {
      if (event.operation === 'remove') {
        this.mediaContent = this.mediaContent.map((obj) => {
          if (obj.displayName === event.id) {
            const index = obj.mediaTagsList.indexOf(event.pillvalue);
            if (index > -1) {
              obj.mediaTagsList.splice(index, 1);
            }
          }
          return obj;
        });
      } else if (event.operation === 'add') {
        this.mediaContent = this.mediaContent.map((obj) => {
          if (obj.displayName === event.id) {
            if (obj.mediaTagsList && obj.mediaTagsList.length > 0) {
              obj.mediaTagsList.push(event.pillvalue);
            } else {
              obj.mediaTagsList = [];
              obj.mediaTagsList.push(event.pillvalue);
            }
          }
          return obj;
        });
      }
    }
  }

  onImageDropped(event): void {
    if (event.addedFiles.length > 0) {
      this.isImageDropped = true;
      this.filesUploaded.push(...event.addedFiles);
      this.uploadFilesToServer();
    }
  }

  onImageRemoved(event): void {
    this.filesUploaded.splice(this.filesUploaded.indexOf(event), 1);
    if (this.filesUploaded.length === 0) {
      this.isImageDropped = false;
    }
    if (this.mediaContent && this.mediaContent.length > 0) {
      this.mediaContent = this.mediaContent.filter((obj) => {
        return obj.displayName !== event.name;
      });
    }
  }

  uploadFilesToServer(): void {
    const brandInfo = {
      BrandID: this._postDetailService.postObj.brandInfo.brandID,
      BrandName: this._postDetailService.postObj.brandInfo.brandName,
    };
    if (this.validateMediaFiles(this.filesUploaded)) {
    this._mediaGalleryService
      .uploadFilesToServer(this.filesUploaded, brandInfo)
      .subscribe((data) => {
        console.log(`file data`, data);
        this.mediaContent = data;
        this._snackBar.open('File uploaded successfully', 'Ok', {
          duration: 1000,
        });
      });
    }
  }

  validateMediaFiles(filesToUpload: any[]): boolean {
    let isValid = true;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < filesToUpload.length; i++) {
      let fileextension = '';
      if (filesToUpload[i].type.indexOf('image') > -1) {
        fileextension = filesToUpload[i].name
          .substring(filesToUpload[i].name.lastIndexOf('.') + 1)
          .toLowerCase();
        if (
          fileextension !== 'gif' &&
          fileextension !== 'png' &&
          fileextension !== 'jpeg' &&
          fileextension !== 'jpg'
        ) {
          this._snackBar.open(
            'Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed',
            'Ok',
            {
              duration: 2000,
            }
          );
          isValid = false;
          break;
        }
        if (filesToUpload[i].size > 5242880) {
          this._snackBar.open(
            'Image size should be less than or equal to 5MB.',
            'Ok',
            {
              duration: 2000,
            }
          );
          isValid = false;
          break;
        }
      }
      if (filesToUpload[i].type.indexOf('video') > -1) {
        fileextension = filesToUpload[i].name
          .substring(filesToUpload[i].name.lastIndexOf('.') + 1)
          .toLowerCase();
        if (
          fileextension !== 'mp4' &&
          fileextension !== 'mov' &&
          fileextension !== 'avi' &&
          fileextension !== 'flv' &&
          fileextension !== 'wmv' &&
          fileextension !== 'mkv'
        ) {
          // WarningModal('Video file type should be MP4, MOV, AVI, WMV or MKV');
          this._snackBar.open(
            'Video file type should be MP4, MOV, AVI, WMV or MKV',
            'Ok',
            {
              duration: 2000,
            }
          );
          isValid = false;
          break;
        }
        if (filesToUpload[i].size > 1073741824) {
          // WarningModal('Video size should be less than or equal to 1 GB.');
          this._snackBar.open(
            'Video size should be less than or equal to 1 GB.',
            'Ok',
            {
              duration: 2000,
            }
          );
          isValid = false;
          break;
        }
      }
    }
    return isValid;
  }

  saveFilesToServer(): void {
    const saveMediaParam: SaveMediaListParameters = {
      brandInfo: this._postDetailService.postObj.brandInfo,
      mediaList: this.mediaContent,
    };
    this._mediaGalleryService
      .saveFilesToServer(saveMediaParam)
      .subscribe((data) => {
        console.log(`file data`, data);
        if (!data.status) {
          this._snackBar.open(`${data.message}`, 'Ok', {
            duration: 2000,
          });
        } else {
          this._mediaGalleryService.LoadMediaGallery.next(true);
          this.dialogRef.close(true);
          this._snackBar.open('File saved successfully', 'Ok', {
            duration: 2000,
          });
        }
      });
  }

  public starAffect(event): void {
    if (this.mediaContent && this.mediaContent.length > 0) {
      this.mediaContent = this.mediaContent.map((obj) => {
        if (obj.displayName === event.id) {
          obj.rating = event.value;
        }
        return obj;
      });
    }
  }

  cancelSaving(): void {
    this._mediaGalleryService.cancelSaving().subscribe((data) => {
      console.log(`cancel data`, data);
      // this._mediaGalleryService.LoadMediaGallery.next(true);
    });
  }

  ngOnDestroy(): void {
    // this._mediaGalleryService.EmitPillsChanged.unsubscribe();
    // this._mediaGalleryService.EmitStarChangeEvent.unsubscribe();
  }
}
