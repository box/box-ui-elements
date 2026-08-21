import * as React from 'react';
import classNames from 'classnames';
import startCase from 'lodash/startCase';
import LabelPillIcon from './LabelPillIcon';
import LabelPillText from './LabelPillText';

import './LabelPill.scss';

export enum LabelPillStatus {
    DEFAULT = 'default',
    INFO = 'info',
    FTUX = 'ftux',
    HIGHLIGHT = 'highlight',
    SUCCESS = 'success',
    WARNING = 'warning',
    ALERT = 'alert',
    ERROR = 'error',
}

export enum LabelPillSize {
    REGULAR = 'regular',
    LARGE = 'large',
}

export interface LabelPillProps {
    /** Content, wrapped in either LabelPill.Text or LabelPill.Icon */
    children: Array<React.ReactChild> | React.ReactChild;
    /** Type of pill */
    type?: LabelPillStatus;
    /** Size of pill */
    size?: LabelPillSize;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillContainer = React.forwardRef((props: LabelPillProps, ref: React.Ref<HTMLSpanElement>) => {
    const { children, type = LabelPillStatus.DEFAULT, size = LabelPillSize.LARGE, className, ...rest } = props;
    const labelPillClasses = classNames(
        'bdl-LabelPill',
        `bdl-LabelPill--${type}`,
        `bdl-LabelPill--size${startCase(size)}`,
        className,
    );
    return (
        <span ref={ref} className={labelPillClasses} {...rest}>
            {children}
        </span>
    );
});

LabelPillContainer.displayName = 'LabelPill';

const LabelPill = {
    Pill: LabelPillContainer,
    Text: LabelPillText,
    Icon: LabelPillIcon,
};

export default LabelPill;
