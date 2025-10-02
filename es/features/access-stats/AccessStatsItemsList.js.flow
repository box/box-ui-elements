// @flow
import * as React from 'react';

import AccessStatsItem from './AccessStatsItem';

type AccessStatsItemsType = {
    commentCount: number,
    commentStatButtonProps: Object,
    downloadCount: number,
    downloadStatButtonProps: Object,
    editCount: number,
    editStatButtonProps: Object,
    hasCountOverflowed: boolean,
    isBoxNote: boolean,
    openAccessStatsModal?: Function,
    previewCount: number,
    previewStatButtonProps: Object,
    viewStatButtonProps: Object,
};

const AccessStatsItemsList = ({
    commentCount,
    commentStatButtonProps,
    downloadCount,
    downloadStatButtonProps,
    editCount,
    editStatButtonProps,
    hasCountOverflowed = false,
    isBoxNote,
    openAccessStatsModal,
    previewCount,
    previewStatButtonProps,
    viewStatButtonProps,
}: AccessStatsItemsType) => (
    <ul className="access-stats-list">
        <AccessStatsItem
            count={previewCount}
            hasCountOverflowed={hasCountOverflowed}
            openAccessStatsModal={openAccessStatsModal}
            statButtonProps={isBoxNote ? viewStatButtonProps : previewStatButtonProps}
            type={isBoxNote ? 'view' : 'preview'}
        />
        <AccessStatsItem
            count={editCount}
            hasCountOverflowed={hasCountOverflowed}
            openAccessStatsModal={openAccessStatsModal}
            statButtonProps={editStatButtonProps}
            type="edit"
        />
        <AccessStatsItem
            count={commentCount}
            hasCountOverflowed={hasCountOverflowed}
            openAccessStatsModal={openAccessStatsModal}
            statButtonProps={commentStatButtonProps}
            type="comment"
        />
        {!isBoxNote && (
            <AccessStatsItem
                count={downloadCount}
                hasCountOverflowed={hasCountOverflowed}
                openAccessStatsModal={openAccessStatsModal}
                statButtonProps={downloadStatButtonProps}
                type="download"
            />
        )}
    </ul>
);

export default AccessStatsItemsList;
