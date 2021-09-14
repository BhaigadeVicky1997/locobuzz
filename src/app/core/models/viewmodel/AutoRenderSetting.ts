import { Tab } from '../menu/Menu'

export interface AutoRenderSetting
{
    tab?: Tab;
    autoRender?: number;
    time?: number;
    autoClose?: boolean;
}

export enum AutoRenderTime
{
    AskBeforeRender = 1,
    AutoRender = 2,
    RenderThirtySec = 3,
    RenderOneMinute = 4,
    RenderTwoMinute = 5
}
