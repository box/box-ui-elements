/**
 * @file PaginationMenu component
 * @author Box
 */

import * as React from 'react';
import range from 'lodash/range';
import { FormattedMessage, useIntl } from 'react-intl';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import DropdownMenu from '../../components/dropdown-menu';
import { Menu, MenuItem } from '../../components/menu';
import messages from '../../elements/common/messages';
import './PaginationMenu.scss';

interface Props {
    onPageClick: (page: number) => void;
    pageCount: number;
    pageNumber: number;
}

const PaginationMenu = ({ onPageClick, pageCount = 0, pageNumber = 0 }: Props) => {
    const intl = useIntl();
    return (
    <DropdownMenu className="bdl-Pagination-dropdown" constrainToWindow isRightAligned>
        <ButtonAdapter className="bdl-Pagination-toggle">
            {intl.formatMessage(messages.pageStatus, { pageNumber, pageCount })}
        </ButtonAdapter>
        <Menu className="bdl-Pagination-dropdownMenu">
            {range(1, pageCount + 1).map(page => (
                <MenuItem key={page} isDisabled={page === pageNumber} onClick={() => onPageClick(page)}>
                    {page}
                </MenuItem>
            ))}
        </Menu>
    </DropdownMenu>
    );
};

export default PaginationMenu;
