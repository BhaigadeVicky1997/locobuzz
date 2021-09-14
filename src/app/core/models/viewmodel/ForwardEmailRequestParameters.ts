import { BaseMention } from '../mentions/locobuzz/BaseMention';
import { AttachmentFile } from './AttachmentFile';
import { GroupEmailList } from './GroupEmailList';

export interface ForwardEmailRequestParameters {
    mention?: BaseMention;
    emailContent?: string;
    toEmailList?: string[];
    ccEmailList?: string[];
    bccEmailList?: string[];
    subject?: string;
    filePathList?: AttachmentFile[];
    isSendGroupMail?: boolean;
    groupEmailList?: GroupEmailList;
}
