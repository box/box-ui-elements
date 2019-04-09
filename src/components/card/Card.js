/* @flow */
import * as React from 'react';
import classNames from 'classnames';

import './Card.scss';

type Props = {
    children: React.Node,
    className?: string,
    hasPadding?: boolean,
    title?: React.Node,
};

const Card = ({ children, className = '', hasPadding = true, title, ...rest }: Props) => (
    <div
        className={classNames(`bdl-Card ${className}`, {
            'bdl-Card--padded': hasPadding,
        })}
        {...rest}
    >
        {title && <div className="bdl-Card-title">{title}</div>}
        {children}
    </div>
);

export default Card;
