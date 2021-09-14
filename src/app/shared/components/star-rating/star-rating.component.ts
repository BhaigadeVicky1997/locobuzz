import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediagalleryService } from 'app/core/services/mediagallery.service';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input() private id: any;
  @Input() private rating: number = 5;
  @Input() private starCount: number = 5;
  @Input() editable: boolean = true;
  @Output() private ratingUpdated = new EventEmitter();

  ratingArr = [];

  constructor(private _mediaGalleryService: MediagalleryService) { }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onStarClick(rating: number): boolean {
    if (this.editable) {
      this.rating = rating;
      this._mediaGalleryService.emitStarChangeEvent({value: rating, id: this.id});
      // this.ratingUpdated.emit({value: rating, id: this.id});
    }
    return false;
  }

  showIcon(index: number): boolean {
    if (this.rating >= index + 1) {
      return true;
    } else {
      return false;
    }
  }
}
