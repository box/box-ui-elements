import * as React from 'react';
import { TwoTonedIcon } from '../iconTypes';
interface SandboxesEmptyStateProps extends TwoTonedIcon {
    primaryColor?: string;
    secondaryColor?: string;
}
declare const SandboxesEmptyState: ({ className, primaryColor, secondaryColor, height, title, width, }: SandboxesEmptyStateProps) => React.JSX.Element;
export default SandboxesEmptyState;
