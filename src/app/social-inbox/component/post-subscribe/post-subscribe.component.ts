import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { take } from 'rxjs/operators';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubSink } from 'subsink/dist/subsink';

@Component({
  selector: 'app-post-subscribe',
  templateUrl: './post-subscribe.component.html',
  styleUrls: ['./post-subscribe.component.scss']
})
export class PostSubscribeComponent implements OnInit, OnDestroy {

  constructor(
    private _replyService: ReplyService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public currentPost: BaseMention,
    private _currentDialog: MatDialogRef<PostSubscribeComponent>
  ) { }
  postDataObj = this.currentPost;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emailCtrl = new FormControl();
  filteredEmails: string[] = [];
  activityType: number = 1;
  subject: string;
  emails: string[] = [];
  sendNewUpdates: boolean = false;
  subscribeLoader: boolean = false;
  modifySubscribeLoader: boolean = false;
  isSubscribe: boolean = false;
  subs = new SubSink();
  subscribeId: number;
  subscribeForm = new FormGroup({
    subscribeTo: new FormControl('', [Validators.required]),
    emailIds: new FormControl([], [Validators.required]),
    subject: new FormControl(''),
    sendNewUpdates: new FormControl(false),
  });
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('subscribeFormElement') subscribeFormElement;
  ngOnInit(): void {
    this.updateFilteredlist();
    this._replyService.getSubscibeData(this.currentPost).pipe(take(1)).subscribe((response) => {
      this.isSubscribe = response.isSubscribe ? response.isSubscribe : false;
      this.subscribeId = response.id;

      if (this.isSubscribe){
        const updateSubscribeInfo = {
          subscribeTo: response?.activityType ? response?.activityType.toString() : '',
          emailIds: response.emailAddress ? response.emailAddress.split(',') : [],
          subject: response.subject ? response.subject : '',
          sendNewUpdates: response.sendOnlyNewUpdates ? response.sendOnlyNewUpdates : false
        };
        this.emails = response.emailAddress ? response.emailAddress.split(',') : [];
        this.subscribeForm.setValue(updateSubscribeInfo);
        this.assignSubject(response?.activityType);
      }
    }
    );
  }

  get emailIds(): any {
    return this.subscribeForm.get('emailIds');
  }

  assignSubject(value): void {
    if (+value === 1) {
      this.subscribeForm.patchValue({ subject: `Activity update regarding Ticket ID - ${this.currentPost.ticketID}` });
    } else if (+value === 2) {
      this.subscribeForm.patchValue({ subject: `Ticket status update regarding  Ticket ID - ${this.currentPost.ticketID}` });
    }
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const valueIndex = this.emails.findIndex(email => email.toLowerCase() === value.toLowerCase());
    if (valueIndex > 0) {
      // Add our email
      if ((value || '').trim()) {
        this.emails.push(value.trim());
        this.emailIds.value.push(value);
        this.emailIds.markAsDirty();
        this.emailIds.updateValueAndValidity();

      }
      this.emailCtrl.setValue(null);
    }
    this.filteredEmails = [];
  }

  removeEmail(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.emailIds.value.splice(index, 1);
      this.emailIds.markAsDirty();
      this.emailIds.updateValueAndValidity();
    }
  }

  selectedEmail(event: MatAutocompleteSelectedEvent): void {
    const itemIndex = this.emails.findIndex(email => email.toLowerCase() === event.option.viewValue.toLowerCase());
    if (itemIndex === -1) {
      this.emails.push(event.option.viewValue);
      this.emailInput.nativeElement.value = '';
      this.emailIds.value.push(event.option.viewValue);
      this.emailIds.updateValueAndValidity();
      this.emailCtrl.setValue(null);
      this.emailIds.markAsDirty();
    } else {
      this._snackBar.open('You have already selected this email', 'ok');
    }
    this.emailInput.nativeElement.blur();
    this.emailInput.nativeElement.value = '';
    this.clearFilteredlist();
  }

  clearFilteredlist(): void {
    this.filteredEmails = [];
  }

  private updateFilteredlist(): void {
    this.subs.add(this.emailCtrl.valueChanges.subscribe((value => {
      if (value !== '') {
        this._replyService.getmailList(value).pipe(take(1)).subscribe(emails => {
          this.filteredEmails = emails;
        });
      } else {
        this.clearFilteredlist();
      }
    })));
  }

  private assignSubscribeParam(status: boolean, isModified: boolean = false): object {
    return {
      EmailAddress: this.emails.join(),
      Subject: this.subscribeForm.get('subject').value,
      ActivityType: +this.subscribeForm.get('subscribeTo').value,
      SendOnlyNewUpdates: this.subscribeForm.get('sendNewUpdates').value,
      IsSubscribe: status,
      TagID: this.currentPost.tagID,
      TicketID: this.currentPost.ticketID,
      BrandID: this.currentPost.brandInfo.brandID,
      BrandName: this.currentPost.brandInfo.brandName,
      ID: this.subscribeId,
      Channel: this.currentPost.channelType,
      IsModified: isModified,
      actionFrom: 0
    };
  }

  modifySubscribe(): void {
    if (this.subscribeForm.valid) {
      this.modifySubscribeLoader = true;
      const subscribeParams = this.assignSubscribeParam(true, true);
      this._replyService.postSubscribe(subscribeParams).subscribe((res) => {
        if (res.success){
          this._snackBar.open(`Subscription modified for ${this.currentPost.ticketID}`, 'ok', {
            duration: 2000
          });
          this.currentPost.ticketInfo.isSubscribed = true;
        }else{
          if (res.message !== ''){
            this._snackBar.open(res.message, 'ok', {
              duration: 2000
            });
          }else{
            this._snackBar.open('Error Occured', 'ok', {
              duration: 2000
            });
          }
        }
        this.modifySubscribeLoader = false;
        this._currentDialog.close();
      },
        err => {
          this._snackBar.open('Error occured', 'ok', {
            duration: 2000
          });
          this.modifySubscribeLoader = false;
        });
    }
  }

  unsubscribePost(): void {
    if (this.subscribeForm.valid) {
      this.subscribeLoader = true;
      const subscribeParams = this.assignSubscribeParam(false);
      this._replyService.postSubscribe(subscribeParams).subscribe((res) => {
        if (res.success){
          this._snackBar.open(`Subscription disabled for Ticket ID: ${this.currentPost.ticketID}`, 'ok', {
            duration: 2000
          });
          this.currentPost.ticketInfo.isSubscribed = false;
        }else{
          if (res.message !== ''){
            this._snackBar.open(res.message, 'ok', {
              duration: 2000
            });
          }else{
            this._snackBar.open('Error Occured', 'ok', {
              duration: 2000
            });
          }

        }
        this.subscribeLoader = false;
        this._currentDialog.close();
      },
        err => {
          this._snackBar.open('Error occured', 'ok');
          this.subscribeLoader = false;
        });
    }
  }

  subscribePost(): void {
    if (this.subscribeForm.valid) {
      this.subscribeLoader = true;
      const subscribeParams = this.assignSubscribeParam(true);

      this._replyService.postSubscribe(subscribeParams).subscribe((res) => {
        if (res.success){
          this._snackBar.open(`Subscription enabled for Ticket ID: ${this.currentPost.ticketID}`, 'ok', {
            duration: 2000
          });
          this.currentPost.ticketInfo.isSubscribed = true;
        }else{
          if (res.message !== ''){
            this._snackBar.open(res.message, 'ok', {
              duration: 2000
            });
          }else{
            this._snackBar.open('Error Occured', 'ok', {
              duration: 2000
            });
          }
        }
        this.subscribeLoader = false;
        this._currentDialog.close();
      },
        err => {
          this._snackBar.open('error occured', 'ok', {
            duration: 2000
          });
          this.subscribeLoader = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();

  }
}
