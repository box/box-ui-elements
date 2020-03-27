import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import SearchForm from '../../../components/search-form';

import messages from '../messages';

class ContentExplorerSearch extends PureComponent {
    static propTypes = {
        intl: PropTypes.any,
        inputValue: PropTypes.string,
        onSubmit: PropTypes.func,
        onInput: PropTypes.func,
        onClearButtonClick: PropTypes.func,
        searchInputProps: PropTypes.object,
    };

    static defaultProps = {
        inputValue: '',
        searchInputProps: {},
    };

    handleChange = value => {
        const { onClearButtonClick, onInput } = this.props;
        if (onInput) {
            onInput(value);
        }
        if (onClearButtonClick && !value) {
            onClearButtonClick();
        }
    };

    handleSubmit = (value, event) => {
        const { onSubmit } = this.props;

        event.preventDefault();
        if (onSubmit) {
            onSubmit();
        }
    };

    render() {
        const { intl, inputValue, searchInputProps } = this.props;

        return (
            <SearchForm
                className="content-explorer-search-container"
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                useClearButton
                value={inputValue}
                {...searchInputProps}
            />
        );
    }
}

export { ContentExplorerSearch as ContentExplorerSearchBase };
export default injectIntl(ContentExplorerSearch);
