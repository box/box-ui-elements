import * as React from 'react';
import { TwoTonedIcon } from '../iconTypes';
interface SecurityBlockedStateProps extends TwoTonedIcon {
    primaryColor?: string;
    secondaryColor?: string;
}
declare const SecurityBlockedState: ({ className, primaryColor, height, secondaryColor, title, width, }: SecurityBlockedStateProps) => React.JSX.Element;
export default SecurityBlockedState;
