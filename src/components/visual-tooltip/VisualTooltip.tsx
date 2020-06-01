import * as React from 'react';
import classNames from 'classnames';

import Tooltip, { TooltipProps, TooltipTheme } from '../tooltip';

import './VisualTooltip.scss';

// We manually set "text" with our specific visual tooltip content.
type OtherTooltipProps = Omit<TooltipProps, 'text'>;

export type VisualTooltipProps = {
    /** A React element to put the tooltip on */
    children: React.ReactChild;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** The string source of the image used in the visual tooltip */
    imageSrc: string;
    /** A string to be used in the tooltip's title heading */
    title: string;
} & OtherTooltipProps;

const VisualTooltip = ({ children, className, content, imageSrc, title, ...otherTooltipProps }: VisualTooltipProps) => {
    const VisualTooltipContent = () => (
        <div className="VisualTooltip--wrap">
            <div className="VisualTooltip--imageWrapper">
                <img src={imageSrc} alt={title} className="VisualTooltip--image" />
            </div>
            <div className="VisualTooltip--contentWrapper">
                <h4 className="VisualTooltip--title">{title}</h4>
                <p className="VisualTooltip--content">{content}</p>
            </div>
        </div>
    );

    return (
        <Tooltip
            className={classNames('VisualTooltip', className)}
            showCloseButton
            theme={TooltipTheme.CALLOUT}
            {...otherTooltipProps}
            text={<VisualTooltipContent />}
        >
            {children}
        </Tooltip>
    );
};

export default VisualTooltip;
