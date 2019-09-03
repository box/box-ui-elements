// @flow
import * as React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import PlainButton from '../../components/plain-button/PlainButton';
import IconEye from '../../icons/general/IconEye';
import IconComment from '../../icons/general/IconComment';
import IconDownloadSolid from '../../icons/general/IconDownloadSolid';
import IconPencilSolid from '../../icons/general/IconPencilSolid';

import messages from './messages';

import './AccessStatsItem.scss';

const statsAttributesTable = {
    preview: {
        icon: IconEye,
        message: messages.accessStatsPreviews,
    },
    view: {
        icon: IconEye,
        message: messages.accessStatsViews,
    },
    download: {
        icon: IconDownloadSolid,
        message: messages.accessStatsDownloads,
    },
    comment: {
        icon: IconComment,
        message: messages.accessStatsComments,
    },
    edit: {
        icon: IconPencilSolid,
        message: messages.accessStatsEdits,
    },
};
const ICON_COLOR = '#2a62b9';
const ITEM_CONTENT_CLASS_NAME = 'access-stats-item-content';

type AccessStatsItemType = {
    count: number,
    hasCountOverflowed?: boolean,
    openAccessStatsModal?: Function,
    statButtonProps: Object,
    type: $Keys<typeof statsAttributesTable>,
};

const AccessStatsItem = ({
    type,
    count = 0,
    hasCountOverflowed = false,
    openAccessStatsModal,
    statButtonProps,
}: AccessStatsItemType) => {
    const statAttributes = statsAttributesTable[type];
    const IconComponent = statAttributes.icon;
    const labelMessage = statAttributes.message;

    const itemContent = (
        <>
            <IconComponent color={ICON_COLOR} height={10} width={14} />
            <span className="access-stats-label">
                <FormattedMessage {...labelMessage} />
            </span>
            <FormattedNumber value={count} />
            {hasCountOverflowed && '+'}
        </>
    );

    return (
        <li className="access-stats-item">
            {openAccessStatsModal ? (
                <PlainButton className={ITEM_CONTENT_CLASS_NAME} onClick={openAccessStatsModal} {...statButtonProps}>
                    {itemContent}
                </PlainButton>
            ) : (
                <span className={ITEM_CONTENT_CLASS_NAME}>{itemContent}</span>
            )}
        </li>
    );
};

export default AccessStatsItem;
