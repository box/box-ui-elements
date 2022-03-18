// @flow
import * as React from 'react';
import classNames from 'classnames';

import SelectorDropdown from '../../components/selector-dropdown';

import QuickSearchMessage from './QuickSearchMessage';
import QuickSearchSelector from './QuickSearchSelector';

import './QuickSearch.scss';

type Props = {
    /** Options to render in the quick search dropdown */
    children?: React.Node,
    /** CSS class for the wrapper div */
    className?: string,
    /** Index at which to insert the divider */
    dividerIndex?: number,
    /** Message to display for the error state */
    errorMessage?: React.Node,
    /** Props for the input element (search bar) */
    inputProps: Object,
    /** Message to display when no results are found */
    noItemsMessage?: React.Node,
    /** Function called with the index of the selected option and the event (selected by keyboard or click) */
    onSelect?: Function,
    /** Optional title text that will be rendered above the list */
    title?: React.Node,
};

type State = {
    showMessage: boolean,
};

class QuickSearch extends React.Component<Props, State> {
    constructor(props: Props) {
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
        const {
            children,
            className,
            dividerIndex,
            errorMessage,
            inputProps,
            noItemsMessage,
            onSelect,
            title,
        } = this.props;
        const { showMessage } = this.state;

        return (
            <div className={classNames('quick-search', className)} onBlur={this.handleBlur} onFocus={this.handleFocus}>
                <SelectorDropdown
                    dividerIndex={dividerIndex}
                    onSelect={onSelect}
                    selector={<QuickSearchSelector {...inputProps} />}
                    title={title}
                >
                    {children}
                </SelectorDropdown>
                {!!errorMessage && <QuickSearchMessage isShown={showMessage}>{errorMessage}</QuickSearchMessage>}
                {!!noItemsMessage && <QuickSearchMessage isShown={showMessage}>{noItemsMessage}</QuickSearchMessage>}
            </div>
        );
    }
}

export default QuickSearch;
