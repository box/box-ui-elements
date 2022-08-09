// @flow
import { PERIOD } from './constants';

type MetricsData = {
    downloadsCount: number,
    previewsCount: number,
    users: Set<string>,
};

type TimeRange = {
    end: number,
    start: number,
    type: TimeRangeType,
};

type GraphDatum = TimeRange & MetricsData;

export type GraphData = Array<GraphDatum>;

export type Period = $Values<typeof PERIOD>;

export type Trend = 'up' | 'down' | 'neutral';

export type ValueAccessor = string | AccessorFunction;
