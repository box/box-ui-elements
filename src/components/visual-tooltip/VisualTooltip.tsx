import * as React from 'react';
import classNames from 'classnames';

import Tooltip, { TooltipProps, TooltipTheme } from '../tooltip';

import './VisualTooltip.scss';

// We manually set "text" with our specific visual tooltip content.
type OtherTooltipProps = Omit<TooltipProps, 'text'>;

export interface VisualTooltipProps extends OtherTooltipProps {
    children: React.ReactChild;
    content: string;
    imageSrc: string;
    title: string;
}

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
