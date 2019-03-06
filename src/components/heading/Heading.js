// @flow
import * as React from 'react';
import isFinite from 'lodash/isFinite';
import classNames from 'classnames';
import HeadingConsumer from './HeadingConsumer';
import './Heading.scss';

type Props = {
    /** Heading contents */
    children: React.Node,
    /** Heading contents */
    className?: string,
    /** Header tag level */
    level?: number,
};

const Heading = ({ children, className = '', level, ...rest }: Props) => {
    return (
        <HeadingConsumer>
            {value => {
                const headingLevel = parseInt(level || value, 10);
                if (isFinite(headingLevel) && (headingLevel < 1 || headingLevel > 6)) {
                    throw new Error('Heading level can only be 1, 2, 3, 4, 5 or 6');
                }
                const type = `h${headingLevel}`;
                return React.createElement(
                    type,
                    {
                        className: classNames(`bdl-Heading--${type}`, className),
                        ...rest,
                    },
                    ...children,
                );
            }}
        </HeadingConsumer>
    );
};

export default Heading;
