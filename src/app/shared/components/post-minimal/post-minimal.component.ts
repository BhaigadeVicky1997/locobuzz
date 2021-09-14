import { Component, Input, OnInit } from '@angular/core';
import { UserOneViewDTO } from 'app/core/models/dbmodel/UserOneViewDTO';

@Component({
  selector: 'app-post-minimal',
  templateUrl: './post-minimal.component.html',
  styleUrls: ['./post-minimal.component.scss']
})
export class PostMinimalComponent implements OnInit {
  @Input() timeline: UserOneViewDTO;
  constructor() { }

  ngOnInit(): void {
    console.log(this.timeline);
  }

}
