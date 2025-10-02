import * as React from 'react';
import { IntlShape } from 'react-intl';
import { GraphData } from './types';
import './GraphCardPreviewsSummary.scss';
interface Props {
    graphData: GraphData;
    intl: IntlShape;
    previousPeriodCount: number;
    totalCount: number;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
