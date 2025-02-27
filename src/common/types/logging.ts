import {
    METRIC_TYPE_PREVIEW,
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
    METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC,
    METRIC_TYPE_UAA_PARITY_METRIC,
} from '../../constants';

export type MetricType =
    | typeof METRIC_TYPE_PREVIEW
    | typeof METRIC_TYPE_ELEMENTS_LOAD_METRIC
    | typeof METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC
    | typeof METRIC_TYPE_UAA_PARITY_METRIC;

export interface ElementsLoadMetricData extends Record<string, unknown> {
    endMarkName: string;
    startMarkName?: string;
}

export interface LoggerProps {
    onPreviewMetric: (data: Record<string, unknown>) => void;
    onReadyMetric: (data: ElementsLoadMetricData) => void;
    onDataReadyMetric?: (data: ElementsLoadMetricData, uniqueId?: string) => void;
}

export interface WithLoggerProps {
    logger?: LoggerProps;
}
