// @flow
import * as React from 'react';
import classNames from 'classnames';

import './QuickSearchMessage.scss';

type Props = {
    /** The message to string or elements to show */
    children: React.Node,
    /** Boolean to indicate if the message should be shown */
    isShown: boolean,
};

const QuickSearchMessage = ({ children, isShown = false }: Props) => {
    const className = classNames('overlay-wrapper', { 'is-visible': isShown }, 'quick-search-message');

    return (
        <div className={className}>
            <p className="overlay">{children}</p>
        </div>
    );
};

export default QuickSearchMessage;
