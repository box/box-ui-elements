// @flow
import * as React from 'react';
import classNames from 'classnames';

import LoadingIndicator from '../../components/loading-indicator';

import './QuickSearchSelector.scss';

type Props = {
    /** CSS class for the wrapper div */
    className?: string,
    /** Props for the input element (search bar) */
    inputProps?: Object,
    /** Function to obtain reference to inner input element */
    inputRef?: Function,
    /** Current loading state */
    isLoading?: boolean,
    /** Function to call on input changes */
    onInput: Function,
    /** Placeholder message in input element */
    placeholder: string,
};

const QuickSearchSelector = ({
    className,
    inputProps = {},
    inputRef,
    isLoading = false,
    onInput,
    placeholder,
    ...rest
}: Props) => (
    <div className="quick-search-selector">
        <input
            {...rest}
            {...inputProps}
            ref={inputRef}
            aria-label={placeholder}
            autoComplete="off"
            className={classNames('search-input', className)}
            onInput={onInput}
            placeholder={placeholder}
            type="text"
        />
        {isLoading && <LoadingIndicator className="loading-indicator" />}
    </div>
);

QuickSearchSelector.displayName = 'QuickSearchSelector';

export default QuickSearchSelector;
