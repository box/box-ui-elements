// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    labelContent: React.Node,
};

const LabelPrimitive = ({ children, className, labelContent, ...rest }: Props) => (
    <label>
        <span className={classNames('label bdl-Label', className)} {...rest}>
            {labelContent}
        </span>
        {children}
    </label>
);

export default LabelPrimitive;
