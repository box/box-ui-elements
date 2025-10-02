import * as React from 'react';
import { Icon } from '../iconTypes';
interface IconCloudProps extends Icon {
    /** An object describing the filter effects for the icon */
    filter?: {
        definition?: React.ReactNode;
        id?: string;
    };
}
declare const IconCloud: ({ className, filter, height, title, width }: IconCloudProps) => React.JSX.Element;
export default IconCloud;
