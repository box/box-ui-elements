import * as React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { PlainButtonProps } from '../plain-button';
import './Media.scss';
export interface MediaMenuProps extends PlainButtonProps, WrappedComponentProps {
    /** Child elements */
    children: Array<React.ReactNode> | React.ReactChild;
    /** Additional class names for the menu button */
    className?: string;
    /** Additional props for the DropdownMenu */
    dropdownProps?: {};
    /** is the dropdown menu button disabled */
    isDisabled?: boolean;
    /** Additional props for the Menu */
    menuProps?: {};
}
declare const _default: React.FC<import("react-intl").WithIntlProps<MediaMenuProps>> & {
    WrappedComponent: React.ComponentType<MediaMenuProps>;
};
export default _default;
