import { PointTypeEnum } from './PointTypeEnum';

export interface ChartPoint {
    xPoint?: any;
    customXPoint?: any;
    xType?: PointTypeEnum;
    yPoint?: number;
    startDate?: string;
    endDate?: string;
    date?: string;
    monthNumber?: number;
    otherValue?: { [key: string]: any; };
}

export interface KeyValue {
    key: string;
    value: any;
}
