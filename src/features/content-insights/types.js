// @flow
import { METRIC, PERIOD, PRESET_TIMES } from './constants';

export type Metric = $Values<typeof METRIC>;

export type Period = $Values<typeof PERIOD>;

export type PresetTimes = $Values<typeof PRESET_TIMES>;

export type TimeRangeType = 'day' | 'week' | 'month';

export type TimeRange = {
    end: number,
    start: number,
    type: TimeRangeType,
};

export type MetricsData = {
    downloadsCount: number,
    previewsCount: number,
    users: Set<string>,
};

export type GraphDatum = TimeRange & MetricsData;

export type GraphData = Array<GraphDatum>;
