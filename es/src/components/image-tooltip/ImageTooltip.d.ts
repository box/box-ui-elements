import * as React from 'react';
import { TooltipProps } from '../tooltip';
import './ImageTooltip.scss';
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
declare const ImageTooltip: ({ children, className, content, image, title, ...otherTooltipProps }: ImageTooltipProps) => React.JSX.Element;
export default ImageTooltip;
