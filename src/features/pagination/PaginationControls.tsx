import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import PaginationMenu from './PaginationMenu';
import messages from '../../elements/common/messages';

import './PaginationControls.scss';

interface Props {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    isOffsetBasedPagination?: boolean;
    onPageClick: (pageNumber: number) => void;
    pageCount: number;
    pageNumber: number;
}

const PaginationControls = ({
    hasNextPage = false,
    hasPreviousPage = false,
    isOffsetBasedPagination = false,
    onPageClick,
    pageCount,
    pageNumber,
}: Props) => {
    const intl = useIntl();
    const handleNextClick = () => {
        onPageClick(pageNumber + 1);
    };

    const handlePreviousClick = () => {
        onPageClick(pageNumber - 1);
    };

    return (
        <div className="bdl-Pagination">
            <ButtonAdapter
                aria-label={intl.formatMessage(messages.previousPage) || ''}
                className="bdl-Pagination-button"
                isDisabled={!hasPreviousPage}
                onClick={handlePreviousClick}
                type={ButtonType.BUTTON}
            >
                <IconPageBack height={9} width={6} />
            </ButtonAdapter>
            <PaginationMenu onPageClick={onPageClick} pageCount={pageCount} pageNumber={pageNumber} />
            <ButtonAdapter
                aria-label={intl.formatMessage(messages.nextPage) || ''}
                className="bdl-Pagination-button"
                isDisabled={!hasNextPage}
                onClick={handleNextClick}
                type={ButtonType.BUTTON}
            >
                <IconPageForward height={9} width={6} />
            </ButtonAdapter>
        </div>
    );
};

export default PaginationControls;
