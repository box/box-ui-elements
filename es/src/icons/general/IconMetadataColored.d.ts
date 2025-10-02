import * as React from 'react';
import { Icon } from '../iconTypes';
interface IconMetadataColoredProps extends Icon {
    /** A string describing the icon's type */
    type?: 'cascade' | 'default';
}
declare const IconMetadataColored: ({ className, color, title, type, width, height, }: IconMetadataColoredProps) => React.JSX.Element;
export default IconMetadataColored;
