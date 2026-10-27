/* eslint-disable @typescript-eslint/no-explicit-any -- Preserve Flow any and Function contracts. */
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
    endMarkName: string;
    startMarkName?: string;
};

type LoggerProps = {
    logError?: (error: Error, errorCode: string, context?: any) => void;
    onPreviewMetric: (data: any) => void;
    onReadyMetric: (data: ElementsLoadMetricData) => void;
};

type WithLoggerProps = {
    logger: LoggerProps;
};

export type { MetricType, ElementsLoadMetricData, LoggerProps, WithLoggerProps };
