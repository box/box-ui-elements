/**
 * @flow
 * @file Header bar
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';
import type { View } from '../../../common/types/core';

import './Header.scss';

type Props = {
    intl: any,
    isHeaderLogoVisible?: boolean,
    isSmall: boolean,
    logoUrl?: string,
    onSearch: Function,
    searchQuery: string,
    view: View,
};

// eslint-disable-next-line react/prop-types
const Header = ({ isHeaderLogoVisible = true, view, isSmall, searchQuery, onSearch, logoUrl, intl }: Props) => {
    const { formatMessage } = intl;
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }) => onSearch(currentTarget.value);
    const searchMessage = formatMessage(messages.searchPlaceholder);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;

    return (
        <div className="be-header">
            {isHeaderLogoVisible && <Logo isSmall={isSmall} url={logoUrl} />}
            <div className="be-search">
                <input
                    aria-label={searchMessage}
                    data-testid="be-Header-searchInput"
                    disabled={!isFolder && !isSearch}
                    onChange={search}
                    placeholder={searchMessage}
                    type="search"
                    value={searchQuery}
                />
            </div>
        </div>
    );
};

export { Header as HeaderBase };
export default injectIntl(Header);
