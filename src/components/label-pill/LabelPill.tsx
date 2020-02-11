import * as React from 'react';
import classNames from 'classnames';
import LabelPillIcon from './LabelPillIcon';
import LabelPillText from './LabelPillText';

import './LabelPill.scss';

export enum LabelPillStatus {
    DEFAULT = 'default',
    INFO = 'info',
    HIGHLIGHT = 'highlight',
    SUCCESS = 'success',
    WARNING = 'warning',
    ALERT = 'alert',
    ERROR = 'error',
}

export interface LabelPillProps {
    /** Content, wrapped in either LabelPill.Text or LabelPill.Icon */
    children: Array<React.ReactChild> | React.ReactChild;
    /** Type of pill */
    type?: LabelPillStatus;
    /** Additional CSS classname(s) */
    className?: string;
}

const LabelPillContainer = React.forwardRef((props: LabelPillProps, ref: React.Ref<HTMLSpanElement>) => {
    const { children, type = LabelPillStatus.DEFAULT, className, ...rest } = props;
    const labelPillClasses = classNames('bdl-LabelPill', className, {
        [`bdl-LabelPill--${type}`]: type !== LabelPillStatus.DEFAULT,
    });
    return (
        <span ref={ref} className={labelPillClasses} {...rest}>
            <span className="bdl-LabelPill-content">{children}</span>
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
