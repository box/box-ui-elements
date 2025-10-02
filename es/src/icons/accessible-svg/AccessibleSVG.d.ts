import * as React from 'react';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';
export interface AccessibleSVGIconProps extends SVGProps {
    'aria-hidden'?: boolean | 'false' | 'true' | undefined;
    'aria-labelledby'?: string;
    children?: React.ReactNode | Array<React.ReactNode>;
    focusable?: boolean | 'false' | 'true' | 'auto' | undefined;
    opacity?: number;
}
declare class AccessibleSVG extends React.Component<AccessibleSVGIconProps> {
    id: string;
    render(): React.JSX.Element;
}
export default AccessibleSVG;
