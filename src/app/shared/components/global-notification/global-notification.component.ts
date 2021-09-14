import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { locobuzzAnimations } from '@locobuzz/animations';
import { FilterService } from 'app/social-inbox/services/filter.service';

@Component({
  selector: 'app-global-notification',
  templateUrl: './global-notification.component.html',
  styleUrls: ['./global-notification.component.scss'],
  animations: locobuzzAnimations
})
export class GlobalNotificationComponent implements OnInit {
  @Output() NotificationStatus: EventEmitter<boolean>  = new EventEmitter();
  @Input() ticketAbouttoBreach: number;
  constructor(private _filterService: FilterService) {
  }

  // @HostListener('click', ['$event'])
//   onClick(event): void {
//     console.log('click event', event
//     );
//     console.log(this.postShortenedData.ticketInfo.ticketID);
//     this.postDetailService.currentPostObject.next(this.postShortenedData.ticketInfo.ticketID);
//  }

  ngOnInit(): void {
  }

  closeNotification(): void{
    this.NotificationStatus.emit(false);
  }

  applyabouttobreach(): void{
    // apply filter of about to breach
    this._filterService.applyabouttobreach();
    this.NotificationStatus.emit(false);
  }

}
