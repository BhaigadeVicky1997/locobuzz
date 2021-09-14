import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialHandle } from 'app/core/models/dbmodel/TicketReplyDTO';

@Component({
  selector: 'app-social-handle',
  templateUrl: './social-handle.component.html',
  styleUrls: ['./social-handle.component.scss']
})
export class SocialHandleComponent implements OnInit {
  @Input() handleNames?: SocialHandle[];
  selectedHandle?: SocialHandle = {};
  @Output() submitSocialHandleEvent = new EventEmitter<SocialHandle>();

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  setSocialHandle(obj: SocialHandle): void
  {
      this.selectedHandle = obj;
  }

  submitActionHandle(): void{
    if (this.selectedHandle)
    {
      this.submitSocialHandleEvent.next(this.selectedHandle);
    }
    else{
      this._snackBar.open('Please select social profile handle', 'Ok', {
        duration: 3000
      });
    }
  }

}
