import * as React from 'react';
import { IntlShape } from 'react-intl';
import './CloseButton.scss';
export interface CloseButtonProps {
    /** Custom class for the close button */
    className?: string;
    /** Intl object */
    intl: IntlShape;
    /** onClick handler for the close button */
    onClick?: Function;
}
declare const _default: React.FC<import("react-intl").WithIntlProps<CloseButtonProps>> & {
    WrappedComponent: React.ComponentType<CloseButtonProps>;
};
export default _default;
