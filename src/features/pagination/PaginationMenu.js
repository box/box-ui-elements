/**
 * @flow
 * @file PaginationMenu component
 * @author Box
 */

import React from 'react';
import range from 'lodash/range';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button';
import DropdownMenu from '../../components/dropdown-menu';
import { Menu, MenuItem } from '../../components/menu';
import messages from '../../elements/common/messages';
import './PaginationMenu.scss';

type Props = {
    onPageClick: Function,
    pageCount: number,
    pageNumber: number,
};

const PaginationMenu = ({ onPageClick, pageCount = 0, pageNumber = 0 }: Props) => (
    <DropdownMenu className="bdl-Pagination-dropdown" constrainToWindow isRightAligned>
        <Button className="bdl-Pagination-toggle">
            <FormattedMessage {...messages.pageStatus} values={{ pageNumber, pageCount }} />
        </Button>
        <Menu className="bdl-Pagination-dropdownMenu">
            {range(1, pageCount + 1).map(page => (
                <MenuItem key={page} isDisabled={page === pageNumber} onClick={() => onPageClick(page)}>
                    {page}
                </MenuItem>
            ))}
        </Menu>
    </DropdownMenu>
);

export default PaginationMenu;
