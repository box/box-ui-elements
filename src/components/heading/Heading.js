// @flow
import * as React from 'react';
import classNames from 'classnames';
import './Heading.scss';

type Props = {
    /** Heading contents */
    children: React.Node,
    /** Heading contents */
    className?: string,
    /** Header tag type */
    type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
};

const Heading = ({ children, className = '', type, ...rest }: Props) =>
    React.createElement(
        type,
        {
            className: classNames(`bdl-${type}`, className),
            ...rest,
        },
        ...children,
    );

export default Heading;
