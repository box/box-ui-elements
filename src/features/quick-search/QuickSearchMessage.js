import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import './QuickSearchMessage.scss';

// eslint-disable-next-line react/prefer-stateless-function
class QuickSearchMessage extends Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
        isShown: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        isShown: false,
    };

    render() {
        const { children, isShown } = this.props;
        const className = classNames('overlay-wrapper', { 'is-visible': isShown }, 'quick-search-message');

        return (
            <div className={className}>
                <p className="overlay">{children}</p>
            </div>
        );
    }
}

export default QuickSearchMessage;
