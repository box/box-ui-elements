/**
 * @flow
 * @file Pagination component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import noop from 'lodash/noop';
import Button from 'box-react-ui/lib/components/button';
import ButtonGroup from 'box-react-ui/lib/components/button-group';
import IconPageBack from 'box-react-ui/lib/icons/general/IconPageBack';
import IconPageForward from 'box-react-ui/lib/icons/general/IconPageForward';
import PaginationMenu from './PaginationMenu';
import Tooltip from '../Tooltip';
import messages from '../messages';
import { DEFAULT_OFFSET, DEFAULT_PAGE_SIZE } from '../../constants';
import './Pagination.scss';

type Props = {
    intl: any,
    offset?: number,
    onChange?: Function,
    pageSize?: number,
    totalCount?: number,
};

const PAGE_ICON_STYLE = {
    height: 9,
    width: 6,
};

const Pagination = ({
    intl,
    offset = DEFAULT_OFFSET,
    onChange = noop,
    pageSize = DEFAULT_PAGE_SIZE,
    totalCount = 0,
}: Props) => {
    function updateOffset(newPageNumber: number) {
        let newOffset = (newPageNumber - 1) * pageSize;

        if (newOffset <= 0) {
            newOffset = 0;
        }

        if (newOffset >= totalCount) {
            newOffset = totalCount - pageSize;
        }

        onChange(newOffset);
    }

    const pageCount = Math.ceil(totalCount / pageSize);
    if (pageCount <= 1) return null;

    const pageNumber = Math.floor(offset / pageSize) + 1;
    const hasNextPage = pageNumber < pageCount;
    const hasPreviousPage = pageNumber > 1;

    const handleNextClick = () => {
        updateOffset(pageNumber + 1);
    };

    const handlePreviousClick = () => {
        updateOffset(pageNumber - 1);
    };

    return (
        <div className="be-pagination">
            <div className="be-pagination-count">
                <PaginationMenu
                    onPageClick={updateOffset}
                    pageCount={pageCount}
                    pageNumber={pageNumber}
                />
            </div>

            <ButtonGroup>
                <Tooltip
                    isEnabled={hasPreviousPage}
                    text={intl.formatMessage(messages.previousPage)}
                >
                    <Button
                        onClick={handlePreviousClick}
                        isDisabled={!hasPreviousPage}
                    >
                        <IconPageBack {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
                <Tooltip
                    isEnabled={hasNextPage}
                    text={intl.formatMessage(messages.nextPage)}
                >
                    <Button onClick={handleNextClick} isDisabled={!hasNextPage}>
                        <IconPageForward {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default injectIntl(Pagination);
