import * as React from 'react';
import { IntlShape } from 'react-intl';
import { GraphData, Metric, Period } from './types';
import './MetricSummary.scss';
interface Props {
    data: GraphData;
    intl: IntlShape;
    metric: Metric;
    period: Period;
    previousPeriodCount: number;
    totalCount?: number;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
