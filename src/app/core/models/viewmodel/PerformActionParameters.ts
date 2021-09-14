import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { Brand } from 'app/shared/components/filter/filter-models/brand-reply.model';
import { BaseSocialAccountConfiguration } from '../accountconfigurations/BaseSocialAccountConfiguration';
import { LocobuzzUser } from '../dbmodel/LocobuzzUser';
import { TicketsCommunicationLog } from '../dbmodel/TicketReplyDTO';
import { BaseMention } from '../mentions/locobuzz/BaseMention';
import { GroupEmailList } from './GroupEmailList';
import { Reply } from './Reply';
import { UgcMention } from './UgcMention';

export interface PerformActionParameters {
    Source?: BaseMention;
    Account?: BaseSocialAccountConfiguration;
    Tasks?: TicketsCommunicationLog[];
    Replies?: Reply[];
    // locobuzzUser?: LocobuzzUser;
    // brands?: Brand[];
    PerformedActionText?: string;
    IsReplyModified?: boolean;
    ActionTaken?: ActionTaken;
    ReplyFromAccountId?: number;
    ReplyFromAuthorSocialId?: string;
}

export class BaseReply {
  replyObj: Reply;
  ugcMention: UgcMention[];
  groupEmailList: GroupEmailList;
  getReplyClass(): Reply
  {
    return ( this.replyObj = {
        $type: 'LocobuzzNG.Entities.Classes.ViewModel.Reply, LocobuzzNG.Entities',
    replyText: '',
    attachments: [],
    attachmentsUgc: this.getAttachmentUGC(),
    taggedUsersJson: '',
    excludedReplyUserIds: '',
    newSelectedTaggedUsersJson: '',
    sendFeedback: false,
    sendAsPrivate: false,
    sendPrivateAsLink: false,
    sendUgc: false,
    eligibleForAutoclosure: false,
    sendToGroups: false,
    groupEmailList: this.getGroupemailList(),
    toGroupEmails: [],
    ccGroupEmails: [],
    bccGroupEmails: [],
    toEmails: [],
    ccEmails: [],
    bccEmails: [],
    teamId: 0,
    teamLeadId: 0,
    timeOffSet: new Date().getTimezoneOffset(),
    parentSocialID: null,
    isReplyScheduled: false,
      });
  }

  getAttachmentUGC(): UgcMention[]
  {
      return (
        this.ugcMention = [{
            $type: 'LocobuzzNG.Entities.Classes.ViewModel.UgcMention, LocobuzzNG.Entities',
    guid: '00000000-0000-0000-0000-000000000000',
    mediaID: 0,
    mediaStatus: 0,
    rating: 0,
    mediaTags: null,
    mediaPath: null,
    isDownloaded: false,
    uGCMediaUrl: null,
    uGCMediaType: 0,
    isUGC: false,
    displayFileName: null,
    durationInSeconds: 0,
    mediaTagsText: '',
        }]
      );
  }
  getGroupemailList(): GroupEmailList
  {
    return (
        this.groupEmailList = {
            $type: 'LocobuzzNG.Entities.Classes.ViewModel.GroupEmailList, LocobuzzNG.Entities',
            groupName: null,
            groupID: 0,
            email_to: null,
            email_cc: null,
            email_bcc: null,
            groupIDs: null,
        }
      );
  }
}
