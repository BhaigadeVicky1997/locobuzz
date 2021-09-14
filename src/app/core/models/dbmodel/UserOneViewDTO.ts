import { TicketTimings } from 'app/core/interfaces/TicketClient';
import { AudioUrl, DocumentUrl, VideoUrl } from './AllBrandsTicketsDTO';

export interface UserOneViewDTO
{
    channelIcon?: string;
    channelGroup?: number;
    firstActivity?: string;
    lastActivity?: string;
    firstSentiment?: string;
    lastSentiMent?: string;
    iconImage?: string;
    messageText?: string;
    userProfile?: string;
    authorName?: string;
    authorLink?: string;
    ticketId?: string;
    mentionDescription?: string;
    imageurls?: string[];
    videoUrls?: VideoUrl[];
    audioUrls?: AudioUrl[];
    documentUrls?: DocumentUrl[];
    LikeCount?: number;
    CommentCount?: number;
    ShareCount?: number;
    twitterfollowerCount?: number;
    ticketTiming?: TicketTimings;
    emailFrom?: string;
    emailTo?: string;
    subject?: string;
    iframeUrl?: string[];
}

export interface UserOneViewModel
{
    firstActivity?: string;
    lastActivity?: string;
    channelIcon?: string;
    firstSentiment?: string;
    lastSentiMent?: string;
}
