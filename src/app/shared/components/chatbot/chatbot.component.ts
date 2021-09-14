import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { MediagalleryService } from 'app/core/services/mediagallery.service';
import { MediaContent } from './../../../core/models/viewmodel/MediaContent';
import { ReplyService } from './../../../social-inbox/services/reply.service';
import { CannedResponseComponent } from './../../../social-inbox/component/canned-response/canned-response.component';
import { ModalService } from './../../services/modal.service';
import { Overlay } from '@angular/cdk/overlay';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PostDetailService } from './../../../social-inbox/services/post-detail.service';
import { BaseMention } from './../../../core/models/mentions/locobuzz/BaseMention';
import { Chatlog, ChatWindowDetails, ChannelInterface, ChatWindowProfiles, ChatItemResponse } from './../../../core/models/viewmodel/ChatWindowDetails';
import { ChatBotService } from './../../../social-inbox/services/chatbot.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { PostReplyComponent } from './../../../social-inbox/component/post-reply/post-reply.component';
import { locobuzzAnimations } from '@locobuzz/animations';
import { MatDialog } from '@angular/material/dialog';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { take } from 'rxjs/operators';
import { MediaGalleryComponent, PostDetailComponent, PostUserinfoComponent } from 'app/social-inbox/component';
import { VideoDialogComponent } from 'app/social-inbox/component/video-dialog/video-dialog.component';
import { Subscription } from 'rxjs';
import { AlertDialogModel, AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { ActionStatusEnum } from 'app/core/enums/ActionStatus';
import { PostActionType } from 'app/core/enums/PostActionType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubSink } from 'subsink/dist/subsink';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  animations: locobuzzAnimations
})
export class ChatbotComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private _chatBotService: ChatBotService,
    private _filterService: FilterService,
    private _postDetailService: PostDetailService,
    private _bottomSheet: MatBottomSheet,
    private _dialog: MatDialog,
    private _modalService: ModalService,
    private _replyService: ReplyService,
    private _mediaGalleryService: MediagalleryService,
    public overlay: Overlay,
    private _snackBar: MatSnackBar,
    public viewContainerRef: ViewContainerRef
  ) { }
  @ViewChild('chatLogElem') private chatLogElem: ElementRef;
  private _tabSubscription: Subscription;
  private _mediaGallerySubscription: Subscription;
  private _filterSubscription: Subscription;
  private _chatSubscription: Subscription;
  private _chatUpdateSubscription: Subscription;
  MediaEnum = MediaEnum;
  chatObject: Array<ChatWindowDetails> = [];
  chatText: string;
  chatAttachement: MediaContent[] = [];
  chatToggle: boolean = false;
  chatExpanded: boolean = false;
  replyToggle: boolean = false;
  channelActiveIndex: number = this._chatBotService.activeChannel;
  userActiveIndex: number = this._chatBotService.activeUser;
  activeUser: ChatWindowProfiles;
  selectedMention: BaseMention;
  channelType: number = 2;
  mentionTimePrev: string;
  mentionTimeCurr: string;
  defaultChatCount: number = this._chatBotService.lazyLoadCount;
  lazyLoading: boolean = false;
  subs = new SubSink();
  filterEmojis: any = ((emojis) => {
    console.log(emojis);
  });
  chattypes: Array<string> = ['LocobuzzNG.Entities.Classes.Mentions.WebsiteChatbotMention', 'LocobuzzNG.Entities.Classes.Mentions.WhatsAppMention', 'LocobuzzNG.Entities.Classes.Mentions.FacebookMention'];
  chatType: { chat: string, log: string } = {
    chat: this.chattypes[this.channelActiveIndex],
    log: 'LocoBuzzRespondDashboardMVCBLL.Classes.TicketClasses.CommunicationLog'
  };
  chatlog: Array<Chatlog> = [];
  channelFetchedData: Array<ChannelInterface> = [];
  channels: Array<ChannelInterface> = this._chatBotService.channels;
  chatProfiles: ChatWindowProfiles[] = [];
  chatProfilesCopy: ChatWindowProfiles[] = [];
  chatCount: number = 0;
  emojiStatus: boolean = false;
  emojSets = ['google', 'google', 'facebook'];
  selectedEmojiSet = this.emojSets[this.channelActiveIndex];
  defaultUserImg: string = '/assets/images/agentimages/sample-image.jpg';
  chatCountReset: boolean = true;
  chatloading: boolean = false;
  ngOnInit(): void {
    this.getDataByDuration();
  }

  private getDataByDuration(callChatService: boolean = true): void {
    this.chatloading = true;
    this._filterSubscription = this._filterService.currentBrandSource.subscribe(
      (value) => {
        if (value) {
          if (callChatService){
            this._chatBotService.getProfilesByChannel();
          }
          this._chatBotService.onChatsRecieved.subscribe((chatData) => {
            this.chatObject = [];
            if (chatData) {
              this.chatObject = chatData;
              this.tabChangeEvent();
              if (callChatService){
                this.openTabWithData();
              }
              this.attachMediaEvent();

              if (!this._chatBotService.chatbotSignalRSubscription){
                this._chatBotService.chatbotSignalR();
                this.chatCount = this._chatBotService.chattotalCount;
              }
              this.chatloading = false;
            }
          },
          err => {
            this.chatloading = false;
          });
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  openTabWithData(): void{
    if (this.chatObject.length > 0){
      for (const [index, chatItem] of this.chatObject.entries()) {
        if (chatItem?.userProfiles && chatItem?.userProfiles.length > 0) {
          this.switchChannel(chatItem?.channelgroupid);
          break;
        }else{
          if (index === this.chatObject.length - 1) {
            this.switchChannel(this.chatObject[0].channelgroupid);
          }
        }
      }
    }
  }

  tabChangeEvent(): void {
    this._tabSubscription = this._chatBotService.tabActiveChange.subscribe((typeValue) => {
      if (typeValue[0] === 'channel') {
        this.channelActiveIndex = typeValue[1];
      } else if (typeValue[0] === 'user') {
        this.userActiveIndex = typeValue[1];
      }
    });
  }

  attachMediaEvent(): void {
    if (this._mediaGallerySubscription) {
      this._mediaGallerySubscription.unsubscribe();
    }
    this._mediaGallerySubscription = this._replyService.selectedMedia.subscribe((ugcarray) => {
      if (ugcarray && ugcarray.length > 0) {
        ugcarray.forEach(ugcItem => {
          this.chatAttachement.push({
            name: ugcItem.displayFileName,
            mediaUrl: ugcItem.mediaPath,
            mediaType: ugcItem.mediaType
          });

          if (this.chatAttachement.length > 0) {
            this.replyToggle = true;
          }
        });
      }
    });
  }

  removeAttachement(index, event): void{
    event.stopPropagation();
    this.chatAttachement.splice(index, 1);
  }

  clearSelectedMedia(replyToggle: boolean = false): void {
    this.replyToggle = replyToggle;
    this.chatAttachement = [];
  }

  excalateReply(): void {
    this._postDetailService.postObj = this.selectedMention;
    this._postDetailService.isBulk = false;
    const replyPostRef = this._bottomSheet.open(PostReplyComponent, {
      ariaLabel: 'Reply',
      panelClass: 'post-reply__wrapper',
      backdropClass: 'no-blur',
      data: { onlyEscalation: true }
    });
  }

  openUserProfile(tabIndex?: number): void {
    this._postDetailService.postObj = this.selectedMention;
    this._postDetailService.tabIndex = tabIndex;
    this._postDetailService.currentPostObject.next(
      this.selectedMention.ticketInfo.ticketID
    );
    const sideModalConfig = this._modalService.getSideModalConfig('chat-profile');
    this._dialog.open(PostUserinfoComponent, {
      ...sideModalConfig,
      width: '360px',
      data: tabIndex,
      autoFocus: false,
    });
  }

  openTicketDetail(): void {
    this._postDetailService.postObj = this.selectedMention;
    this._postDetailService.currentPostObject.next(
      this.selectedMention.ticketInfo.ticketID,
    );
    this._dialog.open(PostDetailComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: ['full-screen-modal'],
    });
  }

  openCannedResponse(): void {
    this._dialog.open(CannedResponseComponent, {
      autoFocus: false,
      width: '850px',
    });
  }


  directCloseTicket(): void {
    const message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed commodo erat imperdiet urna dignissim mattis. Praesent rhoncus libero rhoncus sodales aliquet.';
    const dialogData = new AlertDialogModel(
      'Are you sure want to close this ticket?',
      message,
      'Yes',
      'No'
    );
    const dialogRef = this._dialog.open(AlertPopupComponent, {
      disableClose: true,
      autoFocus: false,
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.closeThisTicket();
      }
    });
  }
  closeThisTicket(): void {
    const performActionObj = this._replyService.BuildReply( this.selectedMention,
      ActionStatusEnum.DirectClose);
    this._replyService.Reply(performActionObj).subscribe((data) => {
      if (data) {
        console.log('closed successful', data);
        const ObjPost = {
          post: this.selectedMention,
          operation: PostActionType.Close
        };
        const chatItem: ChatItemResponse = {
          authorID: this.selectedMention.author.socialId
        };
        // tslint:disable-next-line: no-string-literal
        this._chatBotService.processChats(chatItem, PostActionType.Close);
        this._snackBar.open('Ticket Closed successfully', 'Ok', {
          duration: 2000,
        });
      }
      else {
        this._snackBar.open('Some error occured', 'Ok', {
          duration: 2000,
        });
      }
    });
  }


  private LazyLoadChats(author: ChatWindowProfiles, lazyLoad: boolean = false): void {
    const profileIndex = (author.authorSocialID && this.chatProfiles.length > 0)
      ? this.chatProfiles.findIndex(profile => profile.authorSocialID === author.authorSocialID) : 0;
    const currentProfile = this.chatProfiles[profileIndex];
    const lastMentionEpoch = currentProfile.BaseMentions.filter(
      mention => mention.concreteClassName !== this.chatType.log)[0].mentionTimeEpoch;
    if (!currentProfile?.logEnd || !lazyLoad) {
      this.lazyLoading = true;
      this._chatBotService.lazyLoadPagination.endDateEpoch = lastMentionEpoch;
      this._chatBotService.getChatLog(author, lazyLoad)
        .pipe(take(1))
        .subscribe((response: BaseMention[]) => {
          const lastHeight = this.chatLogElem.nativeElement.scrollHeight;
          let recievedChannelIndex;
          let recievedUserIndex;
          if (response.length > 0){
            const authorId = response.filter(BaseMentionObj => BaseMentionObj.author !== null)[0].author.socialId;
            const responseChats = response.filter(BaseMentionObj => BaseMentionObj.concreteClassName !== this.chatType.log);
            recievedChannelIndex = this.channels.findIndex(channel => channel.channelId === responseChats[0].channelGroup);
            recievedUserIndex = this.chatObject[recievedChannelIndex].userProfiles.findIndex(
              profile => profile.authorSocialID === authorId
            );
            this.chatProfiles[recievedUserIndex].BaseMentions.unshift(...response);
            this.chatProfiles[recievedUserIndex].chats.unshift(
              ...this._chatBotService.structureChatLog(response, this.chatObject[this.channelActiveIndex].channelgroupid)
            );
          }
          if (this.lazyLoading){
            this.chatObject[this.channelActiveIndex].userProfiles[this.userActiveIndex].logEnd = response.filter(
              item => item.isBrandPost === false
            ).length >= this.defaultChatCount ? false : true;
          }
          this.lazyLoading = false;
          setTimeout(() => this.chatLogElem.nativeElement.scrollTop = this.chatLogElem.nativeElement.scrollHeight - lastHeight);
        },
        err => {
          this.lazyLoading = false;
        });
    }
  }

  switchChannel(channelID: number): void {
    const channelIndex = channelID ? this.chatObject.findIndex(chatItem => chatItem.channelgroupid === channelID) : 0;
    this._chatBotService.activeChannel = channelIndex;
    this._chatBotService.changeTab('channel', channelIndex);
    this.chatProfiles = this.chatObject[this.channelActiveIndex]?.userProfiles ?? [];
    if (this.chatProfiles.length > 0) {
      this.switchProfiles(this.chatProfiles[0].authorSocialID);
    }
  }

  switchProfiles(authorId: string): void {
    this.lazyLoading = false;
    this.chatAttachement = [];
    const profileIndex = authorId ? this.chatProfiles.findIndex(profile => profile.authorSocialID === authorId) : 0;
    this._chatBotService.changeTab('user', profileIndex);
    this.activeUser = this.chatObject[this.channelActiveIndex].userProfiles[this.userActiveIndex];
    this.chatlog = [];
    this.chatlog = this.chatObject[this.channelActiveIndex].userProfiles[this.userActiveIndex]?.chats;
    this._chatBotService.assignSelectedBaseMention();
    this.selectedMention = this._chatBotService.selectedBaseMention;
    this._chatBotService.assignRecentChats(authorId);
    this._chatBotService.resetLazyPagination();
    this.chatText = '';
    setTimeout(() => {
      this.scrollToBottom();
      this.activeUser.notificationCount = 0;
      // this._chatBotService.updateChatCount();
    }, 50);
  }

  getDataonScroll(): void {
    if (this.chatLogElem.nativeElement.scrollTop === 0) {
      this.LazyLoadChats(this.activeUser, true);
    }
  }

  replyMessage(): void {
    const attachmentsType = this.chatAttachement.length > 1
    ? MediaEnum.IMAGEANDVIDEOGROUP : this.chatAttachement.length === 1 ? this.chatAttachement[0].mediaType : null;
    const chattext = this.chatText;
    if (chattext.trim() !== '' || this.chatAttachement.length > 0) {
      const chatItem: { chatText: string, isbrandPost: boolean, attachments?: MediaContent[], attachmentsType: number } = {
        chatText: (this.chatAttachement.length > 0 && chattext.trim() === '' ) ? null : this.chatText ,
        isbrandPost: true,
        attachments: this.chatAttachement.length > 0 ? [...this.chatAttachement] : null,
        attachmentsType
      };

      this._chatBotService.processChats(chatItem, PostActionType.update);
      this.chatText = '';
      this.clearSelectedMedia(true);
      this._chatBotService.chatbotReply(chatItem.chatText, chatItem.attachments);
      setTimeout(() => {
        this.scrollToBottom('smooth');
      }, 0);
    }
  }

  toggleChatboxDimension(): void {
    this.chatExpanded = !this.chatExpanded;
    window.dispatchEvent(new Event('resize'));
  }

  toggleReplySection(): void {
    this.chatText = '';
    this.replyToggle = !this.replyToggle;
  }


  openChatBox(): void {
    this.chatToggle = true;
    this._chatBotService.chatbotStatus = true;
    this.tabChangeEvent();
    this.attachMediaEvent();
    this.getDataByDuration(false);
    this._chatUpdateSubscription = this._chatBotService.onChatUpdate.subscribe((data) => {
      if (data && data.status){
      const activeChannelId = this.chatObject[this.channelActiveIndex].channelgroupid;
      if (data.switch){
        if (
          this.chatObject[this.channelActiveIndex].userProfiles
          && this.chatObject[this.channelActiveIndex].userProfiles.length > 0
          ){
          this.switchChannel(activeChannelId);
        }else{
          this.openTabWithData();
        }
      }
      this.chatCount = this._chatBotService.chattotalCount;
      setTimeout(() => {
        this.scrollToBottom('smooth');
      }, 0);
      window.dispatchEvent(new Event('resize'));
      }
    });
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  closeChatBox(): void {
    this.chatToggle = false;
    this._chatBotService.chatbotStatus = false;
    this.clearSelectedMedia();
    if (this._chatSubscription){
      this._chatSubscription.unsubscribe();
    }
    if (this._mediaGallerySubscription) {
      this._mediaGallerySubscription.unsubscribe();
    }
    if (this._tabSubscription) {
      this._tabSubscription.unsubscribe();
    }
    if (this._chatSubscription){
      this._chatUpdateSubscription.unsubscribe();
    }
  }

  scrollToBottom(behavior: string = 'auto'): void {
    try {
      this.chatLogElem.nativeElement.scroll({top: this.chatLogElem.nativeElement.scrollHeight,  behavior});
    } catch (err) { }
  }


  openMediaDialog(): void {
    this._mediaGalleryService.emptySelectedMedia();
    this._dialog.open(MediaGalleryComponent, {
      autoFocus: false,
      panelClass: ['full-screen-modal']
    });
  }

  selectEmoji(event): void {
    this.chatText = this.chatText.concat(event.emoji.native);
  }

  ngOnDestroy(): void {
    if (this._filterSubscription){
      this._filterSubscription.unsubscribe();
    }
    if (this._chatSubscription){
    this._chatSubscription.unsubscribe();
    }
    if (this._chatBotService.chatbotSignalRSubscription){
      this._chatBotService.chatbotSignalRSubscription.unsubscribe();
      }
  }

  openAttachmentPreview(groupIndex: number, chatIndex: number,  attachmentIndex: number): void {
   // alert("open Attachment Preview");
    const attachments = this.chatlog[groupIndex].chats[chatIndex].attachments;
    if (attachments.length > 0){
      const attachmentDialog = this._dialog.open(VideoDialogComponent, {
        panelClass: 'overlay_bgColor',
        data: attachments,
        autoFocus: false
      });
    }
  }
}

