// @flow
import {
    METRIC_TYPE_PREVIEW,
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
    METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC,
} from '../../constants';

type MetricType =
    | typeof METRIC_TYPE_PREVIEW
    | typeof METRIC_TYPE_ELEMENTS_LOAD_METRIC
    | typeof METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC;

type ElementsLoadMetricData = {
    endMarkName: string,
    startMarkName?: string,
};

type LoggerProps = {
    onPreviewMetric: (data: Object) => void,
    onReadyMetric: (data: ElementsLoadMetricData) => void,
};

type WithLoggerProps = {
    logger: LoggerProps,
};

export type { MetricType, ElementsLoadMetricData, LoggerProps, WithLoggerProps };
