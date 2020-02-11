import * as React from 'react';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

export interface LabelPillIconProps {
    /** Icon component */
    Component: React.FunctionComponent<SVGProps>;
}

const LabelPillIcon = ({ Component }: LabelPillIconProps) => (
    <Component className="bdl-LabelPill-iconContent" width={10} height={10} />
);

export default LabelPillIcon;
