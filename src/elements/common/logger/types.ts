import type { ElementOrigin } from '../types';
import type { MetricType, ElementsLoadMetricData } from '../../../common/types/logging';

export interface ElementsMetric extends ElementsLoadMetricData, Record<string, unknown> {
    component: ElementOrigin;
    name: string;
    sessionId: string;
    timestamp: string;
    type: MetricType;
}

export interface Props {
    children: React.ReactElement;
    fileId?: string;
    onMetric: (data: Record<string, unknown>) => void;
    source: ElementOrigin;
    startMarkName?: string;
}
