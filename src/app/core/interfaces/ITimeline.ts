import { ChannelGroup } from "../enums/ChannelGroup";
import { LogStatus } from "../enums/LogStatus";

 export interface ITimeline 
    {
        ChannelGroup?: ChannelGroup;
        Status?:LogStatus;
        MentionTime?:Date;
        MentionTimeEpoch? : Number;
        TicketID?:Number; 
        MentionID ?:string;
        ConcreteClassName?:string;
    }