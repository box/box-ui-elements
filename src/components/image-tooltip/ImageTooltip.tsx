import * as React from 'react';
import classNames from 'classnames';

// @ts-ignore flow import
import Tooltip, { TooltipProps, TooltipTheme } from '../tooltip';
import ImageTooltipContent from './ImageTooltipContent';

import './ImageTooltip.scss';

// We manually set "text" with our specific visual tooltip content.
type OtherTooltipProps = Omit<TooltipProps, 'text'>;

export type ImageTooltipProps = {
    /** A React element to put the tooltip on */
    children: React.ReactElement;
    /** A string to be used in the tooltip's paragraph content */
    content: string;
    /** A React component representing the image used in the visual tooltip */
    image: React.ReactElement;
    /** A string to be used in the tooltip's title heading */
    title: string;
} & OtherTooltipProps;

const ImageTooltip = ({ children, className, content, image, title, ...otherTooltipProps }: ImageTooltipProps) => {
    // State to track if the image has been loaded before displaying the tooltip
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    const tooltipContent = (
        <ImageTooltipContent content={content} onImageLoad={() => setIsImageLoaded(true)} title={title}>
            {React.Children.only(image)}
        </ImageTooltipContent>
    );

    const imageTooltipClasses = classNames('bdl-ImageTooltip', className, {
        'bdl-is-image-loaded': isImageLoaded,
    });

    return (
        <Tooltip
            className={imageTooltipClasses}
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
