import { ChartPoint } from './ChartPoint';

export interface Series {
    seriesName?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    chartType?: string;
    stacking?: string;
    color?: string;
    innerSize?: number;
    otherValue?: { [key: string]: any; };
    chartPoints?: ChartPoint[];
}

export interface ChartResponse {
    success?: boolean;
    message?: string | null;
    data?: Series[];
}
