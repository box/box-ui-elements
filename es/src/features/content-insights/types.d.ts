import { METRIC, PERIOD, PRESET_TIMES } from './constants';
export type Metric = typeof METRIC[keyof typeof METRIC];
export type Period = typeof PERIOD[keyof typeof PERIOD];
export type PresetTimes = typeof PRESET_TIMES[keyof typeof PRESET_TIMES];
export type TimeRangeType = 'day' | 'week' | 'month';
export type TimeRange = {
    end: number;
    start: number;
    type: TimeRangeType;
};
export type MetricsData = {
    downloadsCount: number;
    previewsCount: number;
    users: Set<string>;
};
export type GraphDatum = TimeRange & MetricsData;
export type GraphData = Array<GraphDatum>;
export type ResponseError = Error & {
    data?: string;
    detail?: string;
    errorCode?: string;
    status: number;
    title?: string;
};
