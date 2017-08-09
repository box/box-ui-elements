/**
 * @flow
 * @file Header bar
 * @author Box
 */

import React from 'react';
import Logo from './Logo';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../constants';
import type { View } from '../../flowTypes';
import './Header.scss';

type Props = {
    searchQuery: string,
    onSearch: Function,
    logoUrl?: string,
    isSmall: boolean,
    getLocalizedMessage: Function,
    view: View
};

const Header = ({ view, isSmall, searchQuery, onSearch, logoUrl, getLocalizedMessage }: Props) => {
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }) => onSearch(currentTarget.value);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;
    return (
        <div className='buik-header'>
            <Logo url={logoUrl} isSmall={isSmall} />
            <div className='buik-search'>
                <input
                    type='search'
                    disabled={!isFolder && !isSearch}
                    placeholder={getLocalizedMessage('buik.header.search.placeholder')}
                    value={searchQuery}
                    onChange={search}
                />
            </div>
        </div>
    );
};

export default Header;
