/**
 * @file Header bar
 * @author Box
 */

import * as React from 'react';
import { useIntl } from 'react-intl';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';
import { View } from '../../../common/types/core';

import './Header.scss';

interface HeaderProps {
    isHeaderLogoVisible?: boolean;
    isSmall: boolean;
    logoUrl?: string;
    onSearch: (query: string) => void;
    searchQuery: string;
    view: View;
}

const Header = ({
    isHeaderLogoVisible = true,
    view,
    isSmall,
    searchQuery,
    onSearch,
    logoUrl,
}: HeaderProps): JSX.Element => {
    const { formatMessage } = useIntl();
    const search = ({ currentTarget }: { currentTarget: HTMLInputElement }): void => onSearch(currentTarget.value);
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
export default Header;
