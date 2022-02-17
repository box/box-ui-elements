/**
 * @flow
 * @file Static Versions Item component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from './messages';
import sizeUtil from '../../../utils/size';
import VersionsItemBadge from './VersionsItemBadge';
import { ReadableTime } from '../../../components/time';
import PlainButton from '../../../components/plain-button';

import './VersionsItem.scss';

type Props = {
    versionNumber: string,
    versionTime: string,
};

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const StaticVersionsItem = ({ versionNumber, versionTime }: Props) => {
    // Version info helpers
    const versionTimestamp = new Date(versionTime).getTime();

    const versionDisplayName = <FormattedMessage {...messages.versionUserUnknown} />;

    const buttonClassName = classNames('bcs-VersionsItemButton', {
        'bcs-is-disabled': false,
        'bcs-is-selected': false,
    });

    return (
        <div className="bcs-VersionsItem">
            <PlainButton
                aria-disabled={false}
                className={buttonClassName}
                data-testid="versions-item-button"
                isDisabled
                type="button"
            >
                <div className="bcs-VersionsItem-badge">
                    <VersionsItemBadge versionNumber={versionNumber} />
                </div>

                <div className="bcs-VersionsItem-details">
                    <div className="bcs-VersionsItem-current">
                        <FormattedMessage {...messages.versionCurrent} />
                    </div>

                    <div className="bcs-VersionsItem-log" data-testid="bcs-VersionsItem-log" title={versionDisplayName}>
                        <FormattedMessage {...messages.versionUploadedBy} values={{ name: versionDisplayName }} />
                    </div>

                    <div className="bcs-VersionsItem-info">
                        <time className="bcs-VersionsItem-date" dateTime={versionTime}>
                            <ReadableTime
                                alwaysShowTime
                                relativeThreshold={FIVE_MINUTES_MS}
                                timestamp={versionTimestamp}
                            />
                        </time>
                        <span className="bcs-VersionsItem-size">{sizeUtil(1000)}</span>
                    </div>
                </div>
            </PlainButton>
        </div>
    );
};

export default StaticVersionsItem;
