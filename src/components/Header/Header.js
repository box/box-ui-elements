/**
 * @flow
 * @file Header bar
 * @author Box
 */

import React from 'react';
import Logo from './Logo';
import { Button } from '../Button';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../constants';
import type { View } from '../../flowTypes';
import './Header.scss';

type Props = {
    searchQuery: string,
    onSearch: Function,
    onUpload: Function,
    canUpload?: boolean,
    logoUrl?: string,
    getLocalizedMessage: Function,
    view: View
};

const Header = ({ view, searchQuery, canUpload, onSearch, onUpload, logoUrl, getLocalizedMessage }: Props) => {
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }) => onSearch(currentTarget.value);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;
    return (
        <div className='buik-header'>
            <div className='buik-header-left'>
                <Logo url={logoUrl} />
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
            {canUpload &&
                <Button onClick={onUpload} isDisabled={!isFolder}>
                    {getLocalizedMessage('buik.header.button.upload')}
                </Button>}
        </div>
    );
};

export default Header;
