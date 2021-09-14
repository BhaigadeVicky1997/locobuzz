import { UgcMention } from 'app/core/models/viewmodel/UgcMention';
import { filter } from './../../app-data/ticket';
import { AttachmentMetadata } from './../../core/models/viewmodel/AttachmentMetadata';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocobuzzUtils } from '@locobuzz/utils';
import {
  ActionStatusEnum,
  ClientStatusEnum,
} from 'app/core/enums/ActionStatus';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { ChannelType } from 'app/core/enums/ChannelType';
import { MakerCheckerEnum } from 'app/core/enums/MakerCheckerEnum';
import { MediaEnum } from 'app/core/enums/MediaTypeEnum';
import { PostActionType } from 'app/core/enums/PostActionType';
import { TicketSignalEnum } from 'app/core/enums/TicketSignalEnum';
import { AuthUser } from 'app/core/interfaces/User';
import { BaseSocialAccountConfiguration } from 'app/core/models/accountconfigurations/BaseSocialAccountConfiguration';
import {
  ReplyOptions,
  TicketsCommunicationLog,
} from 'app/core/models/dbmodel/TicketReplyDTO';
import { AccountService } from 'app/core/services/account.service';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import {
  BehaviorSubject,
  forkJoin,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { defaultIfEmpty, map, mergeMap, take } from 'rxjs/operators';
import { ChatWindowDetails } from '../../core/models/viewmodel/ChatWindowDetails';
import {
  BaseMention,
  BaseMentionObjChat,
} from './../../core/models/mentions/locobuzz/BaseMention';
import {
  ChannelInterface,
  ChatItem,
  ChatItemResponse,
  Chatlog,
  ChatWindowProfiles,
  ChatWindowresponse,
} from './../../core/models/viewmodel/ChatWindowDetails';
import { MediaContent } from './../../core/models/viewmodel/MediaContent';
import { LoaderService } from './../../shared/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  currentUser: AuthUser;
  constructor(
    private _filterService: FilterService,
    private _httpClient: HttpClient,
    private _loaderService: LoaderService,
    private _replyService: ReplyService,
    private _ticketSignalrService: TicketsignalrService,
    private _snackBar: MatSnackBar,
    private _accountService: AccountService,
    private _mapLocobuzzEntity: MaplocobuzzentitiesService
  ) {
    this.onChatsRecieved = new BehaviorSubject(null);
    this._accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
  }
  objBrandSocialAcount: BaseSocialAccountConfiguration[];
  chatbotSignalRSubscription: Subscription;
  quickReplies: object;
  public chatbotStatus: boolean = false;
  private filterParams;
  chatObj: Array<ChatWindowDetails> = [];
  chattotalCount: number = 0;
  onChatsRecieved: BehaviorSubject<ChatWindowDetails[]>;
  dataCount: Array<any> = [];
  onChatUpdate: BehaviorSubject<{
    switch: boolean;
    status: boolean;
    countReset?: boolean;
  }> = new BehaviorSubject(null);
  public lazyLoadCount = 10;
  lazyLoadPagination = {
    from: 1,
    to: this.lazyLoadCount,
    endDateEpoch: null,
  };
  chatType: { chat: string[]; log: string } = {
    chat: [
      'LocobuzzNG.Entities.Classes.Mentions.WebsiteChatbotMention',
      'LocobuzzNG.Entities.Classes.Mentions.WhatsAppMention',
      'LocobuzzNG.Entities.Classes.Mentions.FacebookMention',
    ],
    log:
      'LocoBuzzRespondDashboardMVCBLL.Classes.TicketClasses.CommunicationLog',
  };

  channelID = 2;
  activeUser: number = 2;
  activeChannel: number = 0;
  selectedBaseMention: BaseMention;
  tabActiveChange: Subject<[string, number]> = new Subject<[string, number]>();
  channels: Array<ChannelInterface> = [
    {
      name: 'Website',
      image: '/assets/images/channelicons/WebsiteChatBot.svg',
      channelId: ChannelGroup.WebsiteChatBot,
    },
    {
      name: 'Whatsapp',
      image: '/assets/images/channelicons/WhatsApp.svg',
      channelId: ChannelGroup.WhatsApp,
    },
    {
      name: 'Messenger',
      image: '/assets/images/channel-logos/messanger.svg',
      channelId: ChannelGroup.Facebook,
    },
  ];

  public updateChatCount(): any {
    if (this.chatObj.length > 0) {
      this.chattotalCount = 0;
      for (const objItem of this.chatObj) {
        if (objItem.userProfiles && objItem.userProfiles.length > 0) {
          for (const user of objItem.userProfiles) {
            const userNotificationCount: number = user.notificationCount ? user.notificationCount : 0;
            this.chattotalCount += userNotificationCount;
          }
        }
      }
    }
  }

  resetLazyPagination(): void {
    this.lazyLoadPagination = {
      from: 1,
      to: this.lazyLoadCount,
      endDateEpoch: this.filterParams.endDateEpoch,
    };
  }

  changeTab(type: string, value: number): void {
    if (type === 'channel') {
      this.activeChannel = value;
      this.tabActiveChange.next([type, value]);
    } else if (type === 'user') {
      this.activeUser = value;
      this.tabActiveChange.next([type, value]);
    }
  }

  assignSelectedBaseMention(): void {
    if (
      this.chatObj.length > 0 &&
      this.chatObj[this.activeChannel].userProfiles &&
      this.chatObj[this.activeChannel].userProfiles.length > 0
    ) {
      const currentUser = this.chatObj[this.activeChannel]?.userProfiles[
        this.activeUser
      ];
      const currentMentions = currentUser?.BaseMentions;
      if (currentMentions?.length > 0) {
        const recievedMentions = currentMentions.filter(
          (mention) => mention.isBrandPost === false
        );
        this.selectedBaseMention =
          recievedMentions[recievedMentions.length - 1];
      }
    }
  }

  assignRecentChats(authorid): void {
    if (
      this.chatObj[this.activeChannel]?.userProfiles &&
      this.chatObj[this.activeChannel].userProfiles.length > 0
    ) {
      const profileIndex = this.chatObj[
        this.activeChannel
      ].userProfiles.findIndex(
        (userProfile) => userProfile.authorSocialID === authorid
      );
      this.chatObj[this.activeChannel].userProfiles.forEach((profile) => {
        const chatGroupList = profile.chats
          .slice()
          .filter(
            (chatItem) => chatItem.concreteClassName !== this.chatType.log
          );
        let chatList: ChatItem[];
        if (chatGroupList.length > 0) {
          for (const chatGroupItem of chatGroupList.reverse()) {
            if (chatGroupItem.concreteClassName !== this.chatType.log) {
              chatList = chatGroupItem.chats;
              break;
            }
          }
          const lastChatItem = chatList[chatList.length - 1];
          if (lastChatItem.description && lastChatItem.description !== '') {
            profile.lastChat = lastChatItem.description;
          } else {
            profile.lastChat =
              lastChatItem.attachments[
                lastChatItem.attachments.length - 1
              ].name;
          }
        }
      });
    }
  }

  getChatProfiles(channelID): Observable<ChatWindowDetails> {
    this.filterParams = this._filterService.getGenericFilter();
    this.lazyLoadPagination.endDateEpoch = this.filterParams.endDateEpoch;
    this.channelID = channelID;
    const brandIdArray: Array<number> = [];
    this.filterParams.brands.forEach((brand) => {
      brandIdArray.push(brand.brandID);
    });
    const channelParams = {
      Request: {
        Channel: channelID,
        StartDateEpoch: this.filterParams.startDateEpoch,
        EndDateEpoch: this.filterParams.endDateEpoch,
      },
      BrandIDs: brandIdArray,
    };
    return this._httpClient
      .post<ChatWindowresponse>(
        `${environment.baseUrl}/Tickets/GetChatWindowUserCount`,
        channelParams
      )
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  getChatLog(
    author: ChatWindowProfiles,
    lazyLoad: boolean = false
  ): Observable<BaseMention[]> {
    const userParams = {
      BrandInfo: { BrandName: author.brandName, BrandID: author.brandID },
      EndDateEpoch: this.lazyLoadPagination.endDateEpoch,
      AuthorId: author.authorSocialID,
      To: this.lazyLoadPagination.to,
      From: this.lazyLoadPagination.from,
      Channel: author.channelGroup,
      TagID: 0,
    };
    return this._httpClient
      .post<BaseMentionObjChat>(
        `${environment.baseUrl}/Tickets/GetChatWindowCommunication`,
        userParams
      )
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  getProfilesByChannel(): void {
    this.chatObj = [];
    for (const [index, channel] of this.channels.entries()) {
      this.dataCount.push(index);
      this.chatObj.push({ channelgroupid: channel.channelId });
      this.getProfilesAndChats(channel);
    }
  }

  getProfilesAndChats(channel): void {
    this._loaderService.togglComponentLoader({
      section: 'chatlog',
      status: true,
    });
    this.getChatProfiles(channel.channelId)
      .pipe(
        mergeMap((response: ChatWindowDetails) => {
          const baseMentions = response.userProfiles.map((author) =>
            this.getChatLog(author)
          );
          return forkJoin(baseMentions).pipe(
            defaultIfEmpty(null),
            map((allChats) => {
              if (response?.userProfiles.length > 0) {
                response.userProfiles.forEach((profileItem, profileindex) => {
                  profileItem.notificationCount = 0;
                  profileItem.logEnd =
                    allChats[profileindex].filter(
                      (item) => item.isBrandPost === false
                    ).length >= this.lazyLoadCount
                      ? false
                      : true;
                  profileItem.BaseMentions = allChats[profileindex];
                  if (allChats && allChats[profileindex].length > 0) {
                    profileItem.chats = this.structureChatLog(
                      allChats[profileindex],
                      profileItem.channelGroup
                    );
                  }
                });
              }
              return response;
            })
          );
        })
      )
      .pipe(take(1))
      .subscribe((chatData) => {
        if (chatData.userProfiles.length > 0) {
          const channelIndex = this.chatObj.findIndex(
            (chatItem) =>
              chatData.userProfiles[0].channelgroupid ===
              chatItem.channelgroupid
          );
          this.chatObj.splice(channelIndex, 1, {
            channelgroupid: chatData.userProfiles[0].channelgroupid,
            ...chatData,
          });
        }
        this.dataCount.pop();
        if (this.dataCount.length === 0) {
          this.onChatsRecieved.next(this.chatObj);
        }
        this._loaderService.togglComponentLoader({
          section: 'chatlog',
          status: false,
        });
      });
  }

  private mediaTypeLoader(
    mediaContent: MediaContent[],
    attachmentMetadata?: AttachmentMetadata,
    messageTypeStr?: string
  ): { attachmentType?: number; mediaContent?: any } {
    const mediaObj: { attachmentType?: number; mediaContent?: any } = {
      attachmentType: null,
      mediaContent: null,
    };
    const messageType = messageTypeStr
      ? messageTypeStr.toLowerCase()
      : 'NOTE';
    const messageArray: Array<any> = [];
    if (messageType === 'location') {
      mediaObj.attachmentType = MediaEnum.LOCATIONS;
      mediaObj.mediaContent = mediaContent[0].mediaUrl;
      return mediaObj;
    }

    if (
      messageType !== 'text' &&
      attachmentMetadata &&
      attachmentMetadata.mediaContents &&
      attachmentMetadata.mediaContents.length > 0
    ) {
      attachmentMetadata.mediaContents.forEach((mediaItem) => {
        const messagetext = mediaItem.name;
        if (messagetext != null && LocobuzzUtils.isJSON(messagetext)) {
          const media = JSON.parse(messagetext);
          if (media?.message) {
            if (media.message.hasOwnProperty('quick_replies')) {
              if (
                media.message.quick_replies &&
                media.message.quick_replies.length === 1 &&
                media.message.quick_replies[0].content_type === 'location'
              ) {
                // quick reply locations
                mediaObj.attachmentType = MediaEnum.QUICKREPLYLOCATION;
                mediaObj.mediaContent = '';
                return mediaObj;
              } else if (
                media.message?.quick_replies &&
                media.message.quick_replies?.length > 0 &&
                media.message?.quick_replies[0].hasOwnProperty('image_url')
              ) {
                // quick replies payload buttons with icons
                const mediaCopy = JSON.parse(JSON.stringify(media));
                mediaObj.attachmentType = MediaEnum.PAYLOADBUTTONSWITHICONS;
                mediaObj.mediaContent = {
                  text: mediaCopy.message.text,
                  quickReplyButtons: mediaCopy.message.quick_replies,
                };
                return mediaObj;
              } else if (
                media.message?.quick_replies &&
                media.message?.quick_replies.length > 0 &&
                !media.message?.quick_replies[0].hasOwnProperty('image_url')
              ) {
                // quick replies buttons
                const mediaCopy = JSON.parse(JSON.stringify(media));
                mediaObj.attachmentType = MediaEnum.QUICKREPLY;
                mediaObj.mediaContent = {
                  text: mediaCopy.message.text,
                  quickReplyButtons: mediaCopy,
                };
                return mediaObj;
              }
            }
            if (
              media.message.hasOwnProperty('text') &&
              !media.message.hasOwnProperty('quick_replies')
            ) {
              // simple Text
              mediaObj.mediaContent = {
                text: media.message.text,
                quickReplyButtons: null,
              };
            }
            if (media.message.hasOwnProperty('attachment')) {
              if (media.message?.attachment.hasOwnProperty('type')) {
                if (media.message.attachment.type === 'image') {
                  // single image
                  const mediaCopy = JSON.parse(JSON.stringify(media));
                  mediaObj.attachmentType = MediaEnum.IMAGE;
                  mediaObj.mediaContent =
                    mediaCopy.message.attachment.payload.url;
                  return mediaObj;
                } else if (media.message?.attachment?.type === 'video') {
                  // video
                  const mediaCopy = JSON.parse(JSON.stringify(media));
                  mediaObj.attachmentType = MediaEnum.VIDEO;
                  mediaObj.mediaContent =
                    mediaCopy.message.attachment.payload.url;
                  return mediaObj;
                } else if (media.message?.attachment?.type === 'file') {
                  // file
                  const mediaCopy = JSON.parse(JSON.stringify(media));
                  const fileName = mediaCopy.message.attachment.payload.url
                    .replace(/^.*[\\\/]/, '')
                    .split('?')[0];
                  mediaObj.attachmentType = MediaEnum.FILE;
                  mediaObj.mediaContent = {
                    fileName,
                    mediaUrl: mediaCopy.message.attachment.payload.url,
                  };
                  return mediaObj;
                } else if (
                  media.message?.attachment?.type === 'template' &&
                  !media.message?.attachment?.payload.hasOwnProperty(
                    'buttons'
                  ) &&
                  !media.message?.attachment?.payload?.elements[0].hasOwnProperty(
                    'subtitle'
                  ) &&
                  media.message?.attachment?.payload?.elements.length > 0
                ) {
                  // Image with subtitle
                  mediaObj.attachmentType = MediaEnum.IMAGEWITHSUBTITLE;
                  mediaObj.mediaContent = {
                    mediaUrl:
                      media.message?.attachment?.payload?.elements[0]
                        ?.image_url,
                    title:
                      media.message?.attachment?.payload?.elements[0]?.title,
                  };
                  return mediaObj;
                } else if (
                  media.message?.attachment.type === 'template' &&
                  !media.message?.attachment?.payload.hasOwnProperty(
                    'buttons'
                  ) &&
                  media.message?.attachment?.payload?.elements.length > 0
                ) {
                  // Image with title
                  mediaObj.attachmentType = MediaEnum.IMAGEWITHSUBTITLE;
                  mediaObj.mediaContent = {
                    mediaUrl:
                      media.message.attachment.payload.elements[0].image_url,
                    title: media.message.attachment.payload.elements[0].title,
                  };
                  return mediaObj;
                }
              }
            }

            if (media?.message.hasOwnProperty('attachment')) {
              if (media.message?.attachment.hasOwnProperty('payload')) {
                if (
                  media.message.attachment?.payload?.template_type === 'button'
                ) {
                  // Payload Button
                  const mediaCopy = JSON.parse(JSON.stringify(media));
                  mediaObj.attachmentType = MediaEnum.PAYLOADBUTTONS;
                  mediaObj.mediaContent = {
                    text: mediaCopy.message.text,
                    buttons: mediaCopy.message.attachment.payload.buttons,
                  };
                  return mediaObj;
                }
              }
            }

            if (media?.message.hasOwnProperty('attachment')) {
              if (media.message?.attachment.hasOwnProperty('payload')) {
                if (
                  media.message.attachment?.payload.hasOwnProperty('elements')
                ) {
                  if (
                    media.message.attachment.payload?.elements[0].hasOwnProperty(
                      'buttons'
                    )
                  ) {
                    // slider with buttons
                    const mediaCopy = JSON.parse(JSON.stringify(media));
                    mediaObj.attachmentType = MediaEnum.SLIDERBUTTONS;
                    mediaObj.mediaContent = {
                      text: null,
                      buttons: mediaCopy.message.attachment.payload.elements,
                    };
                    return mediaObj;
                  } else {
                    if (
                      media.message.attachment.payload?.elements[0].hasOwnProperty(
                        'subtitle'
                      )
                    ) {
                      // Slider without button
                      const mediaCopy = JSON.parse(JSON.stringify(media));
                      mediaObj.attachmentType = MediaEnum.SLIDERNOBUTTONS;
                      mediaObj.mediaContent = {
                        text: null,
                        buttons: mediaCopy.message.attachment.payload.elements,
                      };
                      return mediaObj;
                    }
                  }
                }
              }
            }
          }
        } else if (messagetext && messagetext.includes('STICKER|')) {
          mediaObj.attachmentType = MediaEnum.STICKER;
          const imgID =
            'divSticker' + Math.floor(Math.random() * Math.floor(1000));
          const arry = messagetext.replace(/\_/g, ' ').split('|');
          const imgurl =
            'https://app.cxmonk.com/images/linestickers/' + arry[2] + '.jpg';
          messageArray.push({
            imageID: imgID,
            imageUrl: imgurl,
          });
          mediaObj.mediaContent = messageArray;
        } else if (messagetext === 'get_started_ping') {
          mediaObj.attachmentType = MediaEnum.PING;
          messageArray.push('Get Started');
          mediaObj.mediaContent = messageArray;
        } else if (attachmentMetadata) {
          mediaObj.attachmentType = MediaEnum.IMAGEANDVIDEOGROUP;
          messageArray.push({
            name: mediaItem.name,
            thumbUrl: mediaItem.thumbUrl,
            mediaUrl: mediaItem.mediaUrl,
            mediaType: mediaItem.mediaType,
          });
          mediaObj.mediaContent = messageArray;
          return mediaObj;
        }
      });
    }
    return mediaObj;
  }

  structureChatLog(
    responseChat: BaseMention[],
    channelGroup: number
  ): Array<Chatlog> {
    const chatlog: Array<Chatlog> = [];
    const channelIndex = this.channels.findIndex(
      (item) => item.channelId === channelGroup
    );
    let mentionStart = moment.utc(responseChat[0].mentionTime);
    let timediff = 0;
    let chats: ChatItem[] = [];
    let isBrand = responseChat[0].isBrandPost;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < responseChat.length; i++) {
      timediff = moment
        .utc(responseChat[i].mentionTime)
        .diff(mentionStart, 'seconds');
      let media;
      if (
        responseChat[i].concreteClassName === this.chatType.chat[channelIndex]
      ) {
        media = this.mediaTypeLoader(responseChat[i].mediaContents, responseChat[i].attachmentMetadata, responseChat[i].messageType );
        chats.push({
          description: responseChat[i].description,
          attachments: media && media.mediaContent ? media.mediaContent : null,
          attachmentsType:
            media && media.attachmentType ? media.attachmentType : null,
          mentionTime: responseChat[i].mentionTime,
          ticketId: responseChat[i].ticketInfo.ticketID,
        });
      } else if (responseChat[i].concreteClassName === this.chatType.log) {
        chatlog.push({
          concreteClassName: responseChat[i].concreteClassName,
          mentionTime: responseChat[i].mentionTime,
          logText: responseChat[i].logText,
        });
      }

      if (responseChat[i].isBrandPost !== isBrand || timediff > 60) {
        chatlog.push({
          concreteClassName: responseChat[i].concreteClassName,
          mentionTime: responseChat[i].mentionTime,
          isBrandPost: responseChat[i].isBrandPost,
          chats,
        });
        isBrand = responseChat[i].isBrandPost;
        chats = [];
        mentionStart = moment.utc(responseChat[i].mentionTime);
      }
    }
    return chatlog;
  }

  updateChats(
    chatItem: ChatItemResponse,
    recievedChannelIndex: number,
    recievedAuthorIndex: number
  ): void {
    let chatsArray = [];
    let BaseMentionArr = [];
    if (recievedAuthorIndex >= 0) {
      chatsArray = [
        {
          concreteClassName: this.chatType.chat[recievedChannelIndex],
          mentionTime: chatItem.mentiontime,
          isBrandPost: chatItem.isbrandPost,
          chats: [
            {
              description: chatItem.chatText || null,
              attachments: chatItem.attachments || null,
              attachmentsType: chatItem.attachmentsType || null,
            },
          ],
        },
      ];

      const activeUser = this.chatObj[recievedChannelIndex].userProfiles[
        recievedAuthorIndex
      ];
      const activeChats = activeUser.chats.filter(
        (chatLog) =>
          chatLog.concreteClassName === this.chatType.chat[recievedChannelIndex]
      );
      const timeNow = moment();
      const timediff = (chatItem.isbrandPost
        ? timeNow
        : moment.utc(chatItem.mentiontime)
      ).diff(
        moment.utc(activeChats[activeChats.length - 1].mentionTime),
        'seconds'
      );
      const chatSenderToggle =
        chatItem.isbrandPost !==
        activeChats[activeChats.length - 1].isBrandPost;
      const chatSingleNode = {
        description: chatItem.chatText || null,
        attachments: chatItem.attachments || null,
        attachmentsType: chatItem.attachmentsType || null,
      };
      const chatGroupNode: any = {
        concreteClassName: this.chatType.chat[recievedChannelIndex],
        mentionTime: chatItem.mentiontime || timeNow,
        isBrandPost: chatItem.isbrandPost,
        chats: [
          {
            description: chatItem.chatText || null,
            attachments: chatItem.attachments || null,
            attachmentsType: chatItem.attachmentsType || null,
            mentionId: chatItem.ticketId || null
          },
        ],
      };
      if (!chatItem.isbrandPost && recievedAuthorIndex !== this.activeUser) {
        activeUser.notificationCount += 1;
      } else {
        activeUser.notificationCount = 0;
      }

      if (!chatSenderToggle) {
        if (timediff < 60) {
          const chatList = this.chatObj[recievedChannelIndex].userProfiles[
            recievedAuthorIndex
          ].chats;
          const lastChatArr = chatList[chatList.length - 1].chats;
          lastChatArr.push(chatSingleNode);
        } else {
          this.chatObj[recievedChannelIndex].userProfiles[
            recievedAuthorIndex
          ].chats.push(chatGroupNode);
        }
      } else {
        this.chatObj[recievedChannelIndex].userProfiles[
          recievedAuthorIndex
        ].chats.push(chatGroupNode);
      }
      this.quickReplies = {};
      this.updateChatCount();
      this.onChatUpdate.next({ status: true, switch: false });
    } else {
      const authorDetail: ChatWindowProfiles = {
        brandName: chatItem.BrandName,
        brandID: chatItem.brandID,
        authorSocialID: chatItem.authorID,
        channelGroup: chatItem.channelGroupId,
      };
      this.getChatLog(authorDetail)
        .pipe(take(1))
        .subscribe((response) => {
          if (response.length > 0) {
            BaseMentionArr = response;
            chatsArray = this.structureChatLog(
              response,
              chatItem.channelGroupId
            );
            if (!this.chatObj[recievedChannelIndex].userProfiles) {
              this.chatObj[recievedChannelIndex].userProfiles = [];
            }
            this.chatObj[recievedChannelIndex].userProfiles.push({
              BaseMentions: BaseMentionArr,
              authorSocialID: chatItem.authorID,
              maskAuthorSocialID: null,
              authorName: chatItem.author,
              url: null,
              picUrl: chatItem.userPic,
              brandName: chatItem.BrandName,
              brandFriendlyName: chatItem.BrandName,
              maskDetailInfo: null,
              channelgroupid: chatItem.channelGroupId,
              count: null,
              brandID: chatItem.brandID,
              userMentionDate: null,
              brandMentionDate: null,
              channelType: chatItem.channelGroupId,
              userMentionDateEpotch: null,
              brandMentionDateEpotch: null,
              channelGroup: null,
              logEnd:
                response.filter((item) => item.isBrandPost === false).length >=
                this.lazyLoadCount
                  ? false
                  : true,
              chats: chatsArray,
            });
            // this.assignRecentChats(this.chatObj[recievedChannelIndex].userProfiles[recievedUserIndex].authorSocialID);
            this.updateChatCount();
            this.onChatUpdate.next({ status: true, switch: false });
          }
        });
    }
  }

  removeChats(recievedChannelIndex: number, recievedAuthorIndex: number, removeUser: boolean = true, ticketid?: number): void {
    if (removeUser){
      this.chatObj[recievedChannelIndex].userProfiles.splice(
        recievedAuthorIndex,
        1
      );
      this.onChatUpdate.next({ status: true, switch: true });
    }else{
      this.chatObj[recievedChannelIndex].userProfiles[recievedAuthorIndex].chats.forEach(
        (chatItem) => {
          chatItem.chats.filter(item => item.ticketId !== ticketid);
        }
      );
    }
  }

  processChats(chatItem: ChatItemResponse, actionType?: number, signalRmessage: string = null): void {
    const recievedChannelIndex = chatItem.channelGroupId
      ? this.channels.findIndex(
          (channel) => channel.channelId === chatItem.channelGroupId
        )
      : this.activeChannel;
    let recievedAuthorIndexByTicketid: number;
    if (this.chatObj[recievedChannelIndex].userProfiles) {
      recievedAuthorIndexByTicketid = chatItem.authorID
        ? this.chatObj[recievedChannelIndex].userProfiles.findIndex(
            (userProfile) => {
              if (chatItem.ticketId) {
                const BaseMentionList = userProfile.BaseMentions.filter(
                  (mentionItem) => mentionItem.isBrandPost === false
                );
                return (
                  chatItem.ticketId ===
                  BaseMentionList[BaseMentionList.length - 1].ticketID
                );
              } else {
                return chatItem.authorID === userProfile.authorSocialID;
              }
            }
          )
        : this.activeUser;
    } else {
      recievedAuthorIndexByTicketid = -1;
    }
    if (recievedAuthorIndexByTicketid === -1) {
      if (
        (actionType === PostActionType.workflowApproveReject &&
          this.currentUser.data.user.userId === +chatItem.userID) ||
        (actionType === PostActionType.assign &&
          this.currentUser.data.user.userId === chatItem.assignToUserID) ||
        (actionType === PostActionType.makerCheckerApprove &&
          (chatItem.replyStatus ===
            ActionStatusEnum.ReplyAndAwaitingCustomerResponse ||
            chatItem.replyStatus === ActionStatusEnum.Open) &&
          this.currentUser.data.user.userId === +chatItem.assignToUserID) ||
        (actionType === PostActionType.makercheckerReject &&
          this.currentUser.data.user.userId === +chatItem.assignToUserID)
      ) {
        this.updateChats(
          chatItem,
          recievedChannelIndex,
          recievedAuthorIndexByTicketid
        );
        this._snackBar.open(signalRmessage, 'Close', {
          duration: 1500,
        });
      }
    } else {
      if (actionType === PostActionType.update) {
        this.updateChats(
          chatItem,
          recievedChannelIndex,
          recievedAuthorIndexByTicketid
        );
      }
      if (
        actionType === PostActionType.assign &&
        this.currentUser.data.user.userId !== chatItem.assignToUserID
      ) {
        // remove based on ticketid and author id
        this.removeChats(recievedChannelIndex, recievedAuthorIndexByTicketid);
        this._snackBar.open(signalRmessage, 'Close', {
          duration: 1500,
        });
      }
      if (
        actionType === PostActionType.Close ||
        actionType === PostActionType.escalate ||
        actionType === PostActionType.replySentForApproval
      ) {
        // remove by user id
        this.removeChats(recievedChannelIndex, recievedAuthorIndexByTicketid);
        this._snackBar.open(signalRmessage, 'Close', {
          duration: 1500,
        });
      }
      if (actionType === PostActionType.enableMakerChecker
        || actionType === PostActionType.disableMakerChecker
        &&  this.chatObj[recievedChannelIndex].userProfiles.length > 0){
        const basemention = this.chatObj[recievedChannelIndex].userProfiles[recievedAuthorIndexByTicketid].BaseMentions;
        const recievedBasemention = basemention.filter(
          (mention) => mention.isBrandPost === false
        );

        if (actionType === PostActionType.enableMakerChecker ){
          recievedBasemention[recievedBasemention.length - 1].ticketInfo.isAutoClosureEnabled = true;
          this._snackBar.open(signalRmessage, 'Close', {
            duration: 1500,
          });
        }

        if (actionType === PostActionType.disableMakerChecker ){
          recievedBasemention[recievedBasemention.length - 1].ticketInfo.isAutoClosureEnabled = false;
          this._snackBar.open(signalRmessage, 'Close', {
            duration: 1500,
          });
        }
      }
    }
    if (
      actionType === PostActionType.makerCheckerApprove ||
      actionType === PostActionType.makerCheckerApprove ||
      (actionType === PostActionType.reOpen &&
        this.currentUser.data.user.userId === +chatItem.userID)
    ) {
      // append chat
      this.updateChats(
        chatItem,
        recievedChannelIndex,
        recievedAuthorIndexByTicketid
      );
      this._snackBar.open(signalRmessage, 'Close', {
        duration: 1500,
      });
    }

    if (
      actionType === PostActionType.caseDetach &&
      this.currentUser.data.user.userId !== chatItem.assignToUserID
    ) {
      // remove based on ticketid and author id
      this.removeChats(recievedChannelIndex, recievedAuthorIndexByTicketid, false, chatItem.ticketId);
    }

    // if (
    //   recievedChannelIndex >= 0 &&
    //   recievedAuthorIndex >= 0 &&
    //   this.chatObj[recievedChannelIndex].userProfiles &&
    //   this.chatObj[recievedChannelIndex].userProfiles.length > 0
    // ) {
    //   this.assignRecentChats(
    //     this.chatObj[recievedChannelIndex].userProfiles[recievedAuthorIndex]
    //       .authorSocialID
    //   );
    // }
    this.onChatUpdate.next({ status: true, switch: false });
    this.updateChatCount();
  }

  BuildComminicationLog(baseMention: BaseMention): TicketsCommunicationLog[] {
    const tasks: TicketsCommunicationLog[] = [];
    const actionEnum = ReplyOptions.GetActionEnum();
    const selectedReplyType = ActionStatusEnum.ReplyAndAwaitingCustomerResponse;
    switch (+selectedReplyType) {
      case ActionStatusEnum.ReplyAndAwaitingCustomerResponse: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.CustomerInfoAwaited
        );
        tasks.push(log1);
        tasks.push(log2);
        // this.replyLinkCheckbox.forEach((obj) => {
        //   if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
        //     const log3 = new TicketsCommunicationLog(
        //       ClientStatusEnum.FeedbackSent
        //     );
        //     tasks.push(log3);
        //   }
        // });

        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.ReplyAwaitingResponse;

        break;
      }
      default:
        break;
    }
    tasks.forEach((obj) => {
      obj.TagID = String(baseMention.tagID);
    });
    return tasks;
  }

  chatbotReply(chattext: string, chatAttachment: MediaContent[]): void {
    this._replyService
      .GetBrandAccountInformation({
        Brand: this.selectedBaseMention.brandInfo,
        ChannelGroup: this.selectedBaseMention.channelGroup,
      })
      .subscribe((data) => {
        let replyObj;
        this.objBrandSocialAcount = data;
        if (this.selectedBaseMention.channelType === ChannelType.FBMessages) {
          if (
            this.objBrandSocialAcount &&
            this.objBrandSocialAcount.length > 0
          ) {
            this.objBrandSocialAcount = this.objBrandSocialAcount.filter(
              (obj) => {
                return (
                  obj.channelGroup === this.selectedBaseMention.channelGroup &&
                  obj.active &&
                  obj.isPrimary &&
                  obj.socialID === this.selectedBaseMention.fbPageID.toString()
                );
              }
            );
          }
        } else if (
          this.selectedBaseMention.channelGroup === ChannelGroup.WhatsApp
        ) {
          if (
            this.selectedBaseMention.whatsAppAccountID > 0 &&
            this.objBrandSocialAcount !== null &&
            this.objBrandSocialAcount.length > 0
          ) {
            this.objBrandSocialAcount = this.objBrandSocialAcount.filter(
              (obj) => {
                return (
                  obj.accountID === this.selectedBaseMention.whatsAppAccountID
                );
              }
            );
          }
        }
        replyObj = this._replyService.BuildReply(
          this.selectedBaseMention,
          ActionStatusEnum.ReplyAndAwaitingCustomerResponse
        );
        replyObj.ActionTaken = ActionTaken.Locobuzz;
        replyObj.Tasks = this.BuildComminicationLog(this.selectedBaseMention);
        const source = this._mapLocobuzzEntity.mapMention(
          this.selectedBaseMention
        );
        replyObj.Source = source;

        replyObj.ReplyFromAuthorSocialId = this.objBrandSocialAcount[0].socialID;
        replyObj.ReplyFromAccountId = this.objBrandSocialAcount[0].accountID;
        replyObj.Replies.push({
          replyText: chattext,
          GroupEmailList: {},
          attachmentsUgc: null

        });
        if (chatAttachment && chatAttachment.length > 0) {
          const ugcMention: UgcMention[] = [];
          chatAttachment.forEach((attachedItem) => {
            ugcMention.push({
              displayFileName: attachedItem.name,
              mediaPath: attachedItem.mediaUrl,
              uGCMediaType: attachedItem.mediaType
            });
          });
          const ugcMentionSelected = this._mapLocobuzzEntity.mapUgcMention(ugcMention);
          replyObj.Replies[0].attachmentsUgc = ugcMentionSelected;
        } else {
          replyObj.Replies.forEach((obj) => {
            obj.attachmentsUgc = null;
          });
        }
        this._replyService.Reply(replyObj).subscribe((response) => {
          console.log(response);
        });
      });
  }

  chatbotSignalR(): void {
    this.chatbotSignalRSubscription = this._ticketSignalrService.chatbotSignalCall.subscribe(
      (chatResponse) => {
        if (chatResponse && chatResponse.message) {
          let signalChannelType = chatResponse.message.channelType
            ? chatResponse.message.channelType
            : chatResponse.message.Data.ChannelType;
          if (!signalChannelType && chatResponse.message?.Data) {
            signalChannelType = chatResponse.message.Data.Channel;
          }
          const signalRmessage = chatResponse.message;
          let channelGroupid;
          if (signalChannelType === ChannelType.WhatsApp) {
            channelGroupid = ChannelGroup.WhatsApp;
          } else if (signalChannelType === ChannelType.FBMessages) {
            channelGroupid = ChannelGroup.Facebook;
          } else {
            channelGroupid = ChannelGroup.WebsiteChatBot;
          }
          let signalRMessage = null;
          if (chatResponse.message && chatResponse.message.Message) {
            signalRMessage = chatResponse.message.Message;
          }
          const attachments: MediaContent[] = [];
          let attachmentType;
          let chatDescription;
          if (signalRmessage?.Data.AttachmentXML) {
            const parseString = require('xml2js').parseString;
            parseString(signalRmessage?.Data.AttachmentXML, (err, result) => {
              if (result && result?.Attachments?.Item.length > 0) {
                result?.Attachments?.Item.forEach((element) => {
                  attachments.push({
                    mediaUrl: element.Url[0],
                    mediaType: element.MediaType[0],
                    displayName: element.Name[0],
                    thumbUrl: element.ThumbUrl[0],
                  });
                  if (signalRmessage.Data.Description) {
                    chatDescription = signalRmessage.Data.Description.replace(
                      element.Url[0],
                      ''
                    );
                  }
                });
              }
            });
            attachmentType = this.mediaTypeLoader(attachments);
          }
          const chatItem: ChatItemResponse = {
            chatText: chatDescription
              ? chatDescription
              : signalRmessage?.Data?.Description
              ? signalRmessage.Data.Description
              : null,
            isbrandPost: signalRmessage?.Data?.IsBrandPost
              ? signalRmessage.Data?.IsBrandPost
              : null,
            channelGroupId: channelGroupid ? channelGroupid : null,
            author: signalRmessage?.Data?.Author
              ? signalRmessage.Data.Author
              : null,
            authorID: signalRmessage?.Data?.StrAuthorID
              ? signalRmessage.Data.StrAuthorID.toString()
              : null,
            userPic: signalRmessage?.Data?.UserPic
              ? signalRmessage.Data.UserPic
              : null,
            mentiontime: signalRmessage?.Data?.MentionTimeEpoch
              ? signalRmessage.Data.MentionTimeEpoch.toString()
              : null,
            brandID: signalRmessage?.BrandID ? signalRmessage?.BrandID : null,
            BrandName: signalRmessage?.Data?.BrandName
              ? signalRmessage?.Data?.BrandName
              : null,
            ticketId: signalRmessage?.TicketID
              ? signalRmessage?.TicketID
              : null,
            userID: signalRmessage?.Data.SenderUserID
              ? signalRmessage?.Data.SenderUserID
              : null,
            assignToUserID: signalRmessage?.Data.AssignedToAgencyUser
              ? +signalRmessage?.Data.AssignedToAgencyUser
              : null,
            replyStatus: signalRmessage?.Data.CaseStatus
              ? +signalRmessage?.Data.CaseStatus
              : null,
            attachments:
              attachments && attachments.length > 0 ? attachments : null,
            attachmentsType: attachmentType ? attachmentType : null,
          };
          if (
            signalChannelType === ChannelType.WhatsApp ||
            signalChannelType === ChannelType.WesiteChatbot ||
            signalChannelType === ChannelType.FacebookChatbot ||
            signalChannelType === ChannelType.AndroidChatbot ||
            signalChannelType === ChannelType.LineChatbot ||
            signalChannelType === ChannelType.WhatsAppChatbot ||
            signalChannelType === ChannelType.FBMessages
          ) {
            if (
              +chatResponse.signalId === TicketSignalEnum.FetchNewData ||
              +chatResponse.signalId === TicketSignalEnum.NewCaseAttach
            ) {
              this.processChats(chatItem, PostActionType.update, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.CloseTicket
            ) {
              this.processChats(chatItem, PostActionType.Close, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.TicketReassigned
            ) {
              this.processChats(chatItem, PostActionType.assign, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.TicketEscalatedToCC ||
              +chatResponse.signalId === TicketSignalEnum.TicketEscalatedToBrand
            ) {
              this.processChats(chatItem, PostActionType.escalate, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.ReOpenTicket
            ) {
              this.processChats(chatItem, PostActionType.reOpen, signalRMessage);
            } else if (
              +chatResponse.signalId ===
                TicketSignalEnum.TicketIgnoredByBrand ||
              +chatResponse.signalId === TicketSignalEnum.TicketIgnoredByCC ||
              +chatResponse.signalId ===
                TicketSignalEnum.TicketApprovedByCCOrBrand
            ) {
              this.processChats(chatItem, PostActionType.workflowApproveReject, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.ReplySentForApproval
            ) {
              this.processChats(chatItem, PostActionType.replySentForApproval, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.ReplyApproved
            ) {
              this.processChats(chatItem, PostActionType.makerCheckerApprove, signalRMessage);
            } else if (
              +chatResponse.signalId === TicketSignalEnum.ReplyRejected
            ) {
              this.processChats(chatItem, PostActionType.makercheckerReject, signalRMessage);
            }else if (
              +chatResponse.signalId === TicketSignalEnum.CaseDetachFrom
            ) {
              this.processChats(chatItem, PostActionType.caseDetach, signalRMessage);
            }else if (
              +chatResponse.signalId === TicketSignalEnum.EnableMakerChecker
            ) {
              this.processChats(chatItem, PostActionType.enableMakerChecker, signalRMessage);
            }
            if (
              +chatResponse.signalId === TicketSignalEnum.DisableMakerChecker
            ) {
              this.processChats(chatItem, PostActionType.disableMakerChecker, signalRMessage);
            }



          }
        }
      }
    );
  }
}
