import { CategoryTagDetails } from '../dbmodel/TagsInformation';
import { Mention } from '../mentions/locobuzz/Mention';

export interface TaggingRequestParameters {
    source?: Mention;
    tagIDs?: CategoryTagDetails[];
    tagAlltagIds?: boolean;
    isTicket?: boolean;
    isAllMentionUnderTicketId?: boolean;
    isTicketCategoryEnabled?: number;
}