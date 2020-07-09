import * as React from 'react';
import classNames from 'classnames';

import Tooltip, { TooltipProps, TooltipTheme } from '../tooltip';
import ImageTooltipContent from './ImageTooltipContent';

import './ImageTooltip.scss';

// We manually set "text" with our specific visual tooltip content.
type OtherTooltipProps = Omit<TooltipProps, 'text'>;

export type ImageTooltipProps = {
    /** A React element to put the tooltip on */
    children: React.ReactChild;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** A React component representing the image used in the visual tooltip */
    image: React.ReactElement;
    /** A string to be used in the tooltip's title heading */
    title: string;
} & OtherTooltipProps;

const ImageTooltip = ({ children, className, content, image, title, ...otherTooltipProps }: ImageTooltipProps) => {
    const tooltipContent = (
        <ImageTooltipContent content={content} title={title}>
            {React.Children.only(image)}
        </ImageTooltipContent>
    );

    return (
        <Tooltip
            className={classNames('bdl-ImageTooltip', className)}
            showCloseButton
            theme={TooltipTheme.CALLOUT}
            {...otherTooltipProps}
            text={tooltipContent}
        >
            {children}
        </Tooltip>
    );
};

export default ImageTooltip;
