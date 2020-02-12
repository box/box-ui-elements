import * as React from 'react';
import classNames from 'classnames';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

export interface LabelPillIconProps {
    /** Icon component */
    Component: React.FunctionComponent<SVGProps>;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillIcon = ({ Component, className }: LabelPillIconProps) => (
    <Component className={classNames('bdl-LabelPill-iconContent', className)} width={10} height={10} />
);

export default LabelPillIcon;
