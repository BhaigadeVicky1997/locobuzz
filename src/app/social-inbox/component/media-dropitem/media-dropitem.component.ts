import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MediagalleryService } from 'app/core/services/mediagallery.service';
import { UgcMention } from 'app/core/models/viewmodel/UgcMention';
import { UpdateMediaDetailParameters } from 'app/core/models/viewmodel/MediaGalleryParameters';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';

@Component({
  selector: 'app-media-dropitem',
  templateUrl: './media-dropitem.component.html',
  styleUrls: ['./media-dropitem.component.scss']
})
export class MediaDropitemComponent implements OnInit {
  @Input() onUpload: boolean = false;
  @Input() image: string;
  @Input() inModal: boolean = false;
  @Input() file: File;
  @Input() displayName: string;
  @Input() ugcMention: UgcMention;
  @Output() removeSelected =  new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: any[] = [];


  constructor(private _mediaGalleryService: MediagalleryService,
              private _snackBar: MatSnackBar,
              private _postDetailService: PostDetailService,
              public dialogRef: MatDialogRef<MediaDropitemComponent>) { }

  ngOnInit(): void {
    console.log(this.image);
    if (this.ugcMention && this.ugcMention.mediaTags)
    {
       const currentTags = JSON.parse(JSON.stringify(this.ugcMention.mediaTags));
       this.tags = currentTags;
    }
  }

  onImageRemoved(file): void{
    this.removeSelected.emit(file);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value).trim()) {
      this.tags.push(value.trim());
      this._mediaGalleryService.emitPillsChanged({operation: 'add', pillvalue: value,
      id: this.file ? this.file.name : this.displayName});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
     }
    if (tag){
      this._mediaGalleryService.emitPillsChanged({operation: 'remove', pillvalue: tag,
       id: this.file ? this.file.name : this.displayName});
    }
    // }
  }
  UpdateFileToServer(): void {
    const updateMediaObj: UpdateMediaDetailParameters = {
      brandInfo: this._postDetailService.postObj.brandInfo,
      mediaID: this._mediaGalleryService.currentUGC.mediaID,
      isUGC: this._mediaGalleryService.currentUGC.isUGC,
      mediaRating: this._mediaGalleryService.currentUGC.rating,
      mediaTags: this._mediaGalleryService.currentUGC.mediaTags
    };
    this._mediaGalleryService.updateFileToServer(updateMediaObj).subscribe((data) => {
      console.log(`file data`, data);
      this._mediaGalleryService.LoadMediaGallery.next(true);
      this.dialogRef.close(true);
      this._snackBar.open(`File Updated Successfully`, 'Ok', {
        duration: 1000
      });
    });
  }

}
