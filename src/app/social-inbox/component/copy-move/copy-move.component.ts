import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
@Component({
  selector: 'app-copy-move',
  templateUrl: './copy-move.component.html',
  styleUrls: ['./copy-move.component.scss']
})
export class CopyMoveComponent implements OnInit {

  selected = 'HDFC';

  brands =[
    {
      img:'assets/images/brands/hdfc.jpg',
      option:'HDFC'
    },
    {
      img:'assets/images/brands/hdfc.jpg',
      option:'BMW'
    },
    {
      img:'assets/images/brands/hdfc.jpg',
      option:'Apple'
    },
    {
      img:'assets/images/brands/hdfc.jpg',
      option:'Bank of Broda'
    }

  ]

  constructor(public select: MatSelectModule, public radio: MatRadioModule) { }

  ngOnInit(): void {
  }



}
