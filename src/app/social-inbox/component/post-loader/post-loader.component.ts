import { locobuzzAnimations } from '@locobuzz/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-loader',
  templateUrl: './post-loader.component.html',
  styleUrls: ['./post-loader.component.scss'],
  animations: locobuzzAnimations
})
export class PostLoaderComponent implements OnInit {

  constructor() { }
  ngOnInit(): void {
  }

}
