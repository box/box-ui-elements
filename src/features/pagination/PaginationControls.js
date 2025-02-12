import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PaginationMenu from './PaginationMenu';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import ButtonGroup from '../../components/button-group';
import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import Tooltip from '../../elements/common/Tooltip';
import messages from '../../elements/common/messages';

// @flow
type Props = {|
    handleNextClick: () => void,
    handlePreviousClick: () => void,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    isOffsetBasedPagination?: boolean,
    onPageClick?: (page: number) => void,
    pageCount?: number,
    pageNumber?: number,
|};

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
}) => {
    return (
        <div className="bdl-Pagination">
            {isOffsetBasedPagination && (
                <div className="bdl-Pagination-count">
                    <PaginationMenu onPageClick={onPageClick} pageCount={pageCount} pageNumber={pageNumber} />
                </div>
            )}
            <ButtonGroup className="bdl-Pagination-nav">
                <Tooltip isDisabled={!hasPreviousPage} text={<FormattedMessage {...messages.previousPage} />}>
                    <ButtonAdapter isDisabled={!hasPreviousPage} onClick={handlePreviousClick} type={ButtonType.BUTTON}>
                        <IconPageBack {...PAGE_ICON_STYLE} />
                    </ButtonAdapter>
                </Tooltip>
                <Tooltip isDisabled={!hasNextPage} text={<FormattedMessage {...messages.nextPage} />}>
                    <ButtonAdapter isDisabled={!hasNextPage} onClick={handleNextClick} type={ButtonType.BUTTON}>
                        <IconPageForward {...PAGE_ICON_STYLE} />
                    </ButtonAdapter>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default PaginationControls;
