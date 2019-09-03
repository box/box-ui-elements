// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import PlainButton from '../../components/plain-button/PlainButton';
import AccessStatsItemsList from './AccessStatsItemsList';

import messages from './messages';

import './AccessStats.scss';

type AccessStatsType = {
    commentCount?: number,
    /**
     * Props for comment stat PlainButton
     */
    commentStatButtonProps?: Object,
    downloadCount?: number,
    /**
     * Props for download stat PlainButton
     */
    downloadStatButtonProps?: Object,
    editCount?: number,
    /**
     * Props for edit stat PlainButton
     */
    editStatButtonProps?: Object,
    errorMessage?: string,
    hasCountOverflowed?: boolean,
    isBoxNote?: boolean,
    /**
     * A function that opens the access stats modal
     */
    openAccessStatsModal?: Function,
    previewCount?: number,
    /**
     * Props for preview stat PlainButton
     */
    previewStatButtonProps?: Object,
    /**
     * Props for View More PlainButton
     */
    viewMoreButtonProps?: Object,
    /**
     * Props for view stat PlainButton
     */
    viewStatButtonProps?: Object,
};

const AccessStats = ({
    commentCount = 0,
    commentStatButtonProps = {},
    downloadCount = 0,
    downloadStatButtonProps = {},
    editCount = 0,
    editStatButtonProps = {},
    errorMessage,
    hasCountOverflowed = false,
    isBoxNote = false,
    openAccessStatsModal,
    previewCount = 0,
    previewStatButtonProps = {},
    viewMoreButtonProps = {},
    viewStatButtonProps = {},
}: AccessStatsType) => (
    <div className="access-stats">
        {errorMessage ? (
            <p>{errorMessage}</p>
        ) : (
            <>
                <AccessStatsItemsList
                    commentCount={commentCount}
                    commentStatButtonProps={commentStatButtonProps}
                    downloadCount={downloadCount}
                    downloadStatButtonProps={downloadStatButtonProps}
                    editCount={editCount}
                    editStatButtonProps={editStatButtonProps}
                    hasCountOverflowed={hasCountOverflowed}
                    isBoxNote={isBoxNote}
                    openAccessStatsModal={openAccessStatsModal}
                    previewCount={previewCount}
                    previewStatButtonProps={previewStatButtonProps}
                    viewStatButtonProps={viewStatButtonProps}
                />
                {openAccessStatsModal && (
                    <PlainButton
                        className="lnk access-stats-view-details"
                        onClick={openAccessStatsModal}
                        {...viewMoreButtonProps}
                    >
                        <FormattedMessage {...messages.accessStatsViewDetails} />
                    </PlainButton>
                )}
            </>
        )}
    </div>
);

export default AccessStats;
