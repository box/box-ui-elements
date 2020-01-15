/**
 * @flow
 * @file Offset Based Pagination component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import Button from '../../../components/button';
import ButtonGroup from '../../../components/button-group';
import IconPageBack from '../../../icons/general/IconPageBack';
import IconPageForward from '../../../icons/general/IconPageForward';
import Tooltip from '../Tooltip';
import messages from '../messages';
import './Pagination.scss';

type Props = {
    hasNextMarker?: boolean,
    hasPrevMarker?: boolean,
    onMarkerBasedPageChange?: Function,
};

const PAGE_ICON_STYLE = {
    height: 9,
    width: 6,
};

const MarkerBasedPagination = ({
    hasNextMarker = false,
    hasPrevMarker = false,
    onMarkerBasedPageChange = noop,
}: Props) => {
    const handleNextClick = () => {
        onMarkerBasedPageChange(1);
    };

    const handlePreviousClick = () => {
        onMarkerBasedPageChange(-1);
    };

    return (
        <div className="be-pagination">
            <ButtonGroup className="be-pagination-nav">
                <Tooltip isDisabled={!hasPrevMarker} text={<FormattedMessage {...messages.previousPage} />}>
                    <Button isDisabled={!hasPrevMarker} onClick={handlePreviousClick}>
                        <IconPageBack {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
                <Tooltip isDisabled={!hasNextMarker} text={<FormattedMessage {...messages.nextPage} />}>
                    <Button isDisabled={!hasNextMarker} onClick={handleNextClick}>
                        <IconPageForward {...PAGE_ICON_STYLE} />
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
};

export default MarkerBasedPagination;
