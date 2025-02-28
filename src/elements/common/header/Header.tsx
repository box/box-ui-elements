import * as React from 'react';
import { useIntl } from 'react-intl';
import { SearchInput } from '@box/blueprint-web';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';
import type { View } from '../../../common/types/core';

import './Header.scss';

export interface HeaderProps {
    isHeaderLogoVisible?: boolean;
    logoUrl?: string;
    onSearch: (value: string) => void;
    view: View;
}

const Header = ({ isHeaderLogoVisible = true, logoUrl, onSearch, view }: HeaderProps) => {
    const { formatMessage } = useIntl();
    const searchMessage = formatMessage(messages.searchPlaceholder);
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;

    return (
        <div className="be-header">
            {isHeaderLogoVisible && <Logo url={logoUrl} />}
            <div className="be-search">
                <SearchInput
                    disabled={!isFolder && !isSearch}
                    onChange={onSearch}
                    placeholder={searchMessage}
                    searchInputAriaLabel={searchMessage}
                    searchInputClearAriaLabel={formatMessage(messages.searchClear)}
                    variant="global"
                />
            </div>
        </div>
    );
};

export default Header;
