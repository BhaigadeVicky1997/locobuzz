import { SsreIntent } from 'app/core/enums/ssreIntentEnum';
import { SSREMode } from 'app/core/enums/ssreLogStatusEnum';
import { BaseMention } from '../mentions/locobuzz/BaseMention';

export interface ReplyInputParams
{
    makerchticketId?: number;
    SSREMode?: SSREMode;
    SsreIntent?: SsreIntent;
    onlyEscalation?: boolean;
    postObj?: BaseMention;
    onlySendMail?: boolean;
}
