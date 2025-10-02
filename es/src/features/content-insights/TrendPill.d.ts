import * as React from 'react';
import { IntlShape } from 'react-intl';
import { Period } from './types';
import './TrendPill.scss';
interface Props {
    intl: IntlShape;
    period: Period;
    trend: number;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
