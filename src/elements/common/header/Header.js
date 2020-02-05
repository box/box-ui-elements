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
import type { View } from '../../../common/types/core';

import './Header.scss';

type Props = {
    intl: any,
    isSmall: boolean,
    logoUrl?: string,
    onSearch: Function,
    searchQuery: string,
    view: View,
};

// eslint-disable-next-line react/prop-types
const Header = ({ view, isSmall, searchQuery, onSearch, logoUrl, intl }: Props) => {
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }) => onSearch(currentTarget.value);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;
    return (
        <div className="be-header">
            <Logo isSmall={isSmall} url={logoUrl} />
            <div className="be-search">
                <input
                    aria-label="search"
                    disabled={!isFolder && !isSearch}
                    onChange={search}
                    placeholder={intl.formatMessage(messages.searchPlaceholder)}
                    type="search"
                    value={searchQuery}
                />
            </div>
        </div>
    );
};

export default injectIntl(Header);
