import * as React from 'react';
import type { View } from '../../../common/types/core';
import './Header.scss';
export interface HeaderProps {
    isHeaderLogoVisible?: boolean;
    logoUrl?: string;
    onSearch: (value: string) => void;
    view: View;
}
declare const Header: ({ isHeaderLogoVisible, logoUrl, onSearch, view }: HeaderProps) => React.JSX.Element;
export default Header;
