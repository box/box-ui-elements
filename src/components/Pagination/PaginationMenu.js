/**
 * @flow
 * @file PaginationMenu component
 * @author Box
 */

import React from 'react';
import range from 'lodash/range';
import Button from 'box-react-ui/lib/components/button';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu';
import { Menu, MenuItem } from 'box-react-ui/lib/components/menu';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import './PaginationMenu.scss';

type Props = {
    onPageClick: Function,
    pageCount: number,
    pageNumber: number,
};

const PaginationMenu = ({
    onPageClick,
    pageCount = 0,
    pageNumber = 0,
}: Props) => (
    <DropdownMenu
        className="be-pagination-dropdown"
        constrainToWindow
        isRightAligned
    >
        <Button className="be-pagination-toggle">
            <FormattedMessage
                {...messages.pageStatus}
                values={{ pageNumber, pageCount }}
            />
        </Button>
        <Menu className="be-pagination-dropdown-menu">
            {range(1, pageCount + 1).map(page => (
                <MenuItem
                    key={page}
                    isDisabled={page === pageNumber}
                    onClick={() => onPageClick(page)}
                >
                    {page}
                </MenuItem>
            ))}
        </Menu>
    </DropdownMenu>
);

export default PaginationMenu;
