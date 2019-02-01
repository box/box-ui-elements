// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    labelContent: React.Node,
};

const LabelPrimitive = ({ children, className, labelContent, ...rest }: Props) => (
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label>
        <span className={classNames('label', className)} {...rest}>
            {labelContent}
        </span>
        {children}
    </label>
);

export default LabelPrimitive;
