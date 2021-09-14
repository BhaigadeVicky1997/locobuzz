import { locobuzzAnimations } from './../../../@locobuzz/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reply-loader',
  templateUrl: './reply-loader.component.html',
  styleUrls: ['./reply-loader.component.scss'],
  animations: locobuzzAnimations
})
export class ReplyLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
