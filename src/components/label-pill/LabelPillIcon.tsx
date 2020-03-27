import * as React from 'react';
import classNames from 'classnames';
import { SVGProps } from '../../components/accessible-svg/AccessibleSVG';

export interface LabelPillIconProps {
    /** Icon component */
    Component: React.FunctionComponent<SVGProps>;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillIcon = ({ Component, className, ...rest }: LabelPillIconProps) => (
    <Component className={classNames('bdl-LabelPill-iconContent', className)} width={12} height={12} {...rest} />
);

export default LabelPillIcon;
