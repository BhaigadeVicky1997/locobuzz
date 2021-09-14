import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {
  MediaEnum = MediaEnum;
  constructor( @Inject(MAT_DIALOG_DATA) Attachments: Array<object>) {
    this.attachmentData = Attachments || [];
   }
   attachmentData: Array<object> = [];
  ngOnInit(): void {
  }

}
