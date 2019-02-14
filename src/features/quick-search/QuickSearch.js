import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import SelectorDropdown from '../../components/selector-dropdown';

import QuickSearchMessage from './QuickSearchMessage';
import QuickSearchSelector from './QuickSearchSelector';

import './QuickSearch.scss';

class QuickSearch extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        inputProps: PropTypes.object.isRequired,
        noItemsMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        onSelect: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            showMessage: false,
        };
    }

    handleFocus = () => {
        this.setState({ showMessage: true });
    };

    handleBlur = () => {
        this.setState({ showMessage: false });
    };

    render() {
        const { children, className, errorMessage, inputProps, noItemsMessage, onSelect } = this.props;
        const { showMessage } = this.state;

        return (
            <div className={classNames('quick-search', className)} onBlur={this.handleBlur} onFocus={this.handleFocus}>
                <SelectorDropdown onSelect={onSelect} selector={<QuickSearchSelector {...inputProps} />}>
                    {children}
                </SelectorDropdown>
                {!!errorMessage && <QuickSearchMessage isShown={showMessage}>{errorMessage}</QuickSearchMessage>}
                {!!noItemsMessage && <QuickSearchMessage isShown={showMessage}>{noItemsMessage}</QuickSearchMessage>}
            </div>
        );
    }
}

export default QuickSearch;
