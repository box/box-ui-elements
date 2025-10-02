import * as React from 'react';
import { Icon } from '../iconTypes';
interface IconAddTagsProps extends Icon {
    /** A number specifying the stroke width of the SVG */
    strokeWidth?: number;
}
declare const IconAddTags: ({ className, height, color, title, strokeWidth, width, }: IconAddTagsProps) => React.JSX.Element;
export default IconAddTags;
