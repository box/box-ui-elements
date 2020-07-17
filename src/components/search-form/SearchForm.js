// @flow
import * as React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames';
import omit from 'lodash/omit';

import ClearBadge16 from '../../icon/fill/ClearBadge16';
import Search16 from '../../icon/fill/Search16';

import makeLoadable from '../loading-indicator/makeLoadable';

import './SearchForm.scss';

const messages = defineMessages({
    clearButtonTitle: {
        defaultMessage: 'Clear',
        description: 'Title for a clear button',
        id: 'boxui.searchForm.clearButtonTitle',
    },
    searchButtonTitle: {
        defaultMessage: 'Search',
        description: 'Title for a search button',
        id: 'boxui.searchForm.searchButtonTitle',
    },
    searchLabel: {
        defaultMessage: 'Search query',
        description: 'Label for a search input',
        id: 'boxui.searchForm.searchLabel',
    },
});

type Props = {
    /** Form submit action */
    action?: string,
    className?: string,
    getSearchInput?: Function,
    intl: Object,
    isLoading?: boolean,
    /** The way to send the form data, get or post */
    method?: 'get' | 'post',
    /** Name of the text input */
    name?: string,
    /** On change handler for the search input, debounced by 250ms */
    onChange?: Function,
    /** On submit handler for the search input */
    onSubmit?: Function,
    /** Extra query parameters in addition to the form data */
    queryParams: Object,
    /** Boolean to prevent propogation of search clear action */
    shouldPreventClearEventPropagation?: boolean,
    /** If the clear button is shown when input field is not empty */
    useClearButton?: boolean,
    /** The value of the input if controlled */
    value?: string,
};

type State = {
    isEmpty: boolean,
};

class SearchForm extends React.Component<Props, State> {
    static defaultProps = {
        action: undefined,
        method: 'get',
        name: 'search',
        queryParams: {},
        useClearButton: false,
    };

    state = {
        isEmpty: true,
    };

    static getDerivedStateFromProps(props: Props): any {
        const { value } = props;

        if (value && !!value.trim()) {
            return {
                isEmpty: true,
            };
        }

        return null;
    }

    onClearHandler = (event: SyntheticEvent<>) => {
        const { onChange, shouldPreventClearEventPropagation } = this.props;
        if (shouldPreventClearEventPropagation) {
            event.stopPropagation();
        }

        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.setState({ isEmpty: true });

        if (onChange) {
            onChange('');
        }
    };

    onChangeHandler = ({ target }) => {
        const { value } = target;
        const { onChange } = this.props;
        this.setState({ isEmpty: !value || !value.trim().length });

        if (onChange) {
            onChange(value);
        }
    };

    onSubmitHandler = event => {
        const { value } = event.target.elements[0];
        const { onSubmit } = this.props;

        if (onSubmit) {
            onSubmit(value, event);
        }
    };

    setInputRef = element => {
        this.searchInput = element;

        if (this.props.getSearchInput) {
            this.props.getSearchInput(this.searchInput);
        }
    };

    searchInput: ?HTMLInputElement;

    render() {
        const { action, className, intl, isLoading, method, name, queryParams, useClearButton, ...rest } = this.props;
        const { isEmpty } = this.state;

        const inputProps = omit(rest, [
            'getSearchInput',
            'onChange',
            'onSubmit',
            'required',
            'shouldPreventClearEventPropagation',
        ]);

        const { formatMessage } = intl;
        const classes = classNames(className, 'search-input-container');
        const formClassNames = classNames('search-form', {
            'is-empty': isEmpty,
            'use-clear-button': useClearButton,
        });
        const hiddenInputs = Object.keys(queryParams).map((param, index) => (
            <input key={index} name={param} type="hidden" value={queryParams[param]} />
        ));

        const SearchActions = () => (
            <div className="action-buttons">
                <button
                    type="button"
                    className="action-button search-button"
                    title={formatMessage(messages.searchButtonTitle)}
                >
                    <Search16 />
                </button>
                <button
                    className="action-button clear-button"
                    onClick={this.onClearHandler}
                    title={formatMessage(messages.clearButtonTitle)}
                    type="button"
                >
                    <ClearBadge16 />
                </button>
            </div>
        );

        const LoadableSearchActions = makeLoadable(SearchActions);

        // @NOTE Prevent errors from React about controlled inputs
        const onChangeStub = () => {};

        return (
            <div className={classes}>
                <form
                    action={action}
                    className={formClassNames}
                    method={method}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    role="search"
                >
                    <input
                        ref={this.setInputRef}
                        aria-label={formatMessage(messages.searchLabel)}
                        autoComplete="off"
                        className="search-input"
                        name={name}
                        onChange={onChangeStub}
                        type="search"
                        {...inputProps}
                    />
                    <LoadableSearchActions
                        isLoading={isLoading}
                        loadingIndicatorProps={{
                            className: 'search-form-loading-indicator',
                        }}
                    />
                    {hiddenInputs}
                </form>
            </div>
        );
    }
}

export default injectIntl(SearchForm);
