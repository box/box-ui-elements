import * as React from 'react';
import { Icon } from '../iconTypes';
interface IconBell2Props extends Icon {
    /** A boolean indicating whether this icon is filled or just outlined */
    isFilled?: boolean;
}
declare const IconBell2: ({ className, color, isFilled, height, title, width, }: IconBell2Props) => React.JSX.Element;
export default IconBell2;
