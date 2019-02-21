/**
 * @flow
 * @file Pagination component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Button from '../../../components/button';
import ButtonGroup from '../../../components/button-group';
import IconPageBack from '../../../icons/general/IconPageBack';
import IconPageForward from '../../../icons/general/IconPageForward';
import PaginationMenu from './PaginationMenu';
import Tooltip from '../Tooltip';
import messages from '../messages';
import { DEFAULT_PAGE_SIZE } from '../../../constants';
import './Pagination.scss';

type Props = {
    offset?: number,
    onChange?: Function,
    pageSize?: number,
    totalCount?: number,
};

const PAGE_ICON_STYLE = {
    height: 9,
    width: 6,
};

const Pagination = ({ offset = 0, onChange = noop, pageSize = DEFAULT_PAGE_SIZE, totalCount = 0 }: Props) => {
    const pageCount = Math.ceil(totalCount / pageSize);
    if (pageCount <= 1) return null;

    const pageByOffset = Math.floor(offset / pageSize) + 1;
    const pageNumber = pageByOffset > 0 ? Math.min(pageCount, pageByOffset) : 1;
    const hasNextPage = pageNumber < pageCount;
    const hasPreviousPage = pageNumber > 1;

    const updateOffset = (newPageNumber: number) => {
        let newOffset = (newPageNumber - 1) * pageSize;

        if (newOffset <= 0) {
            newOffset = 0;
        }

        if (newOffset >= totalCount) {
            newOffset = totalCount - pageSize;
        }

        onChange(newOffset);
    };

    const handleNextClick = () => {
        updateOffset(pageNumber + 1);
    };

    const handlePreviousClick = () => {
        updateOffset(pageNumber - 1);
    };

    return (
        <div className="be-pagination">
            <div className="be-pagination-count">
                <PaginationMenu onPageClick={updateOffset} pageCount={pageCount} pageNumber={pageNumber} />
            </div>

            <ButtonGroup className="be-pagination-nav">
                <Tooltip isDisabled={!hasPreviousPage} text={<FormattedMessage {...messages.previousPage} />}>
                    <Button isDisabled={!hasPreviousPage} onClick={handlePreviousClick}>
                        <IconPageBack {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
                <Tooltip isDisabled={!hasNextPage} text={<FormattedMessage {...messages.nextPage} />}>
                    <Button isDisabled={!hasNextPage} onClick={handleNextClick}>
                        <IconPageForward {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default Pagination;
