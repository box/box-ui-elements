import * as React from 'react';
import Tooltip from '../tooltip';
import Button from '../button';
import './GuideTooltip.scss';
type TooltipProps = Omit<JSX.LibraryManagedAttributes<typeof Tooltip, Tooltip['props']>, 'text' | 'theme'>;
type Props = TooltipProps & {
    body: React.ReactNode;
    title?: React.ReactNode;
    /** 32px x 32px */
    icon?: React.ReactNode;
    /** A React component representing the image, cannot be used together with icon */
    image?: React.ReactNode;
    /** displays guide progress e.g. 1 of 4 */
    steps?: [number, number];
    primaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
    secondaryButtonProps?: JSX.LibraryManagedAttributes<typeof Button, Button['props']>;
};
declare function GuideTooltip({ body, children, className, icon, image, isShown, primaryButtonProps, steps, secondaryButtonProps, showCloseButton, title, ...rest }: Props): React.JSX.Element;
export default GuideTooltip;
