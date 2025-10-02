/**
 * @flow strict
 * @file Pagination controls for navigation
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PaginationMenu from './PaginationMenu';
import Button from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import Tooltip from '../../elements/common/Tooltip';
import messages from '../../elements/common/messages';

type Props = {
    handleNextClick: () => void,
    handlePreviousClick: () => void,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    isOffsetBasedPagination?: boolean,
    onPageClick?: number => void,
    pageCount?: number,
    pageNumber?: number,
};

const PAGE_ICON_STYLE = {
    height: 9,
    width: 6,
};

const PaginationControls = ({
    handleNextClick,
    handlePreviousClick,
    hasNextPage,
    hasPreviousPage,
    isOffsetBasedPagination = true,
    onPageClick,
    pageCount = 0,
    pageNumber = 0,
}: Props) => {
    return (
        <div className="bdl-Pagination">
            {isOffsetBasedPagination && (
                <div className="bdl-Pagination-count">
                    <PaginationMenu onPageClick={onPageClick} pageCount={pageCount} pageNumber={pageNumber} />
                </div>
            )}
            <ButtonGroup className="bdl-Pagination-nav">
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

export default PaginationControls;
