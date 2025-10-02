import * as React from 'react';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';
export interface LabelPillIconProps {
    /** Icon component */
    Component: React.FunctionComponent<SVGProps>;
    /** Additional CSS classname(s) */
    className?: string;
}
declare const LabelPillIcon: ({ Component, className, ...rest }: LabelPillIconProps) => React.JSX.Element;
export default LabelPillIcon;
