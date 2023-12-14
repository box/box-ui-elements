import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import ClearBadge16 from '../../icon/fill/ClearBadge16';
import Search16 from '../../icon/fill/Search16';
import makeLoadable from '../loading-indicator/makeLoadable';

import messages from './messages';

export interface SearchActionsProps {
    /** Whether to render an interactive search button */
    hasSubmitAction: boolean;
    /** Intl object */
    intl: IntlShape;
    /** Called when clear button is clicked */
    onClear: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

const SearchActions = ({ hasSubmitAction, intl, onClear }: SearchActionsProps) => {
    const { formatMessage } = intl;

    return (
        <div className="action-buttons">
            {hasSubmitAction ? (
                <button
                    type="submit"
                    className="action-button search-button"
                    title={formatMessage(messages.searchButtonTitle)}
                >
                    <Search16 />
                </button>
            ) : (
                <div className="action-button search-button">
                    <Search16 />
                </div>
            )}
            <button
                className="action-button clear-button"
                onClick={onClear}
                title={formatMessage(messages.clearButtonTitle)}
                type="button"
            >
                <ClearBadge16 />
            </button>
        </div>
    );
};

export { SearchActions as SearchActionsBase };
export default makeLoadable(injectIntl(SearchActions));
