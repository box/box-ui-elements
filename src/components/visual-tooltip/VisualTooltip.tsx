import * as React from 'react';
import classNames from 'classnames';

import Tooltip, { TooltipProps, TooltipTheme } from '../tooltip';
import VisualTooltipContent from './VisualTooltipContent';

import './VisualTooltip.scss';

// We manually set "text" with our specific visual tooltip content.
type OtherTooltipProps = Omit<TooltipProps, 'text'>;

export type VisualTooltipProps = {
    /** A React element to put the tooltip on */
    children: React.ReactChild;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** The string source of the image used in the visual tooltip */
    image: React.ReactNode;
    /** A string to be used in the tooltip's title heading */
    title: string;
} & OtherTooltipProps;

const VisualTooltip = ({ children, className, content, image, title, ...otherTooltipProps }: VisualTooltipProps) => {
    return (
        <Tooltip
            className={classNames('bdl-VisualTooltip', className)}
            showCloseButton
            theme={TooltipTheme.CALLOUT}
            {...otherTooltipProps}
            text={<VisualTooltipContent content={content} image={image} title={title} />}
        >
            {children}
        </Tooltip>
    );
};

export default VisualTooltip;
