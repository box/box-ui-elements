import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, IconButton, Tooltip } from '@box/blueprint-web';
import { PointerChevronLeft, PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';

import messages from '../messages';

import './Pagination.scss';

export interface PaginationControlsProps {
    handleNextClick: () => void;
    handlePreviousClick: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isOffsetBasedPagination?: boolean;
    isSmall: boolean;
    offset?: number;
    pageSize?: number;
    totalCount?: number;
}

const PaginationControls = ({
    handleNextClick,
    handlePreviousClick,
    hasNextPage,
    hasPreviousPage,
    isOffsetBasedPagination = true,
    isSmall,
    offset = 0,
    pageSize = 0,
    totalCount = 0,
}: PaginationControlsProps) => {
    const { formatMessage } = useIntl();
    const startEntryIndex = offset + 1;
    const endEntryIndex = Math.min(offset + pageSize, totalCount);

    return (
        <div className="bdl-Pagination">
            {isOffsetBasedPagination && (
                <FormattedMessage
                    {...messages.pageEntryStatus}
                    values={{ startEntryIndex, endEntryIndex, totalCount }}
                />
            )}
            <div className="bdl-Pagination-buttons">
                <Tooltip content={formatMessage(messages.previousPage)}>
                    {isSmall ? (
                        <IconButton
                            aria-label={formatMessage(messages.previousPageButton)}
                            className="bdl-Pagination-iconButton"
                            disabled={!hasPreviousPage}
                            onClick={handlePreviousClick}
                            icon={PointerChevronLeft}
                        />
                    ) : (
                        <Button disabled={!hasPreviousPage} onClick={handlePreviousClick} variant="secondary">
                            {formatMessage(messages.previousPageButton)}
                        </Button>
                    )}
                </Tooltip>
                <Tooltip content={formatMessage(messages.nextPage)}>
                    {isSmall ? (
                        <IconButton
                            aria-label={formatMessage(messages.nextPageButton)}
                            className="bdl-Pagination-iconButton"
                            disabled={!hasNextPage}
                            onClick={handleNextClick}
                            icon={PointerChevronRight}
                        />
                    ) : (
                        <Button disabled={!hasNextPage} onClick={handleNextClick} variant="secondary">
                            {formatMessage(messages.nextPageButton)}
                        </Button>
                    )}
                </Tooltip>
            </div>
        </div>
    );
};

export default PaginationControls;
