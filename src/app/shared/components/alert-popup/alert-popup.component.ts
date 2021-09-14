import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit {
  title: string;
  message: string;
  yesText: string;
  noText: string;
  isHtml: boolean;
  constructor(public dialogRef: MatDialogRef<AlertPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AlertDialogModel
            ) {
    this.title = data.title;
    this.message = data.message;
    this.yesText = data.yesText;
    this.noText = data.noText;
    this.isHtml = data.isHtml;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}

export class AlertDialogModel {
  constructor(
    public title: string,
    public message: string,
    public yesText?: string,
    public noText?: string,
    public isHtml: boolean = true
  ) {
  }
}
