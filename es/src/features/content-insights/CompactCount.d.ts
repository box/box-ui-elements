import * as React from 'react';
import { IntlShape } from 'react-intl';
interface Props {
    className?: string;
    count: number;
    intl: IntlShape;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;
