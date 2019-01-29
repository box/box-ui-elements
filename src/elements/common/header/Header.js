/**
 * @flow
 * @file Header bar
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';

import './Header.scss';

type Props = {
    searchQuery: string,
    onSearch: Function,
    logoUrl?: string,
    isSmall: boolean,
    view: View,
} & InjectIntlProvidedProps;

// eslint-disable-next-line react/prop-types
const Header = ({ view, isSmall, searchQuery, onSearch, logoUrl, intl }: Props) => {
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }) => onSearch(currentTarget.value);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;
    return (
        <div className="be-header">
            <Logo url={logoUrl} isSmall={isSmall} />
            <div className="be-search">
                <input
                    type="search"
                    disabled={!isFolder && !isSearch}
                    placeholder={intl.formatMessage(messages.searchPlaceholder)}
                    value={searchQuery}
                    onChange={search}
                />
            </div>
        </div>
    );
};

export default injectIntl(Header);
