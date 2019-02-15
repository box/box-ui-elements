import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import LoadingIndicator from '../../components/loading-indicator';

import './QuickSearchSelector.scss';

const QuickSearchSelector = ({
    className,
    inputProps = {},
    inputRef,
    isLoading = false,
    onInput,
    placeholder,
    ...rest
}) => (
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

QuickSearchSelector.propTypes = {
    className: PropTypes.string,
    inputProps: PropTypes.object,
    inputRef: PropTypes.func,
    isLoading: PropTypes.bool,
    onInput: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default QuickSearchSelector;
