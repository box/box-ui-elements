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

type Props = {
    versionNumber: string,
};

const StaticVersionsItem = ({ versionNumber }: Props) => {
    const versionDisplayName = <FormattedMessage {...messages.versionStaticUser} />;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const versionTimestamp = new Date(yesterday).getTime();

    const buttonClassName = classNames('bcs-static-VersionsItemButton', {
        'bcs-is-selected': versionNumber === '1',
    });

    return (
        <div className="bcs-static-VersionsItem">
            <PlainButton
                aria-disabled={false}
                className={buttonClassName}
                data-testid="versions-item-button"
                isDisabled
                type="button"
            >
                <div className="bcs-static-VersionsItem-badge">
                    <VersionsItemBadge versionNumber={versionNumber} />
                </div>

                <div className="bcs-static-VersionsItem-details">
                    {versionNumber === '1' && (
                        <div className="bcs-static-VersionsItem-current">
                            <FormattedMessage {...messages.versionCurrent} />
                        </div>
                    )}

                    <div
                        className="bcs-static-VersionsItem-log"
                        data-testid="bcs-VersionsItem-log"
                        title={versionDisplayName}
                    >
                        <FormattedMessage {...messages.versionUploadedBy} values={{ name: versionDisplayName }} />
                    </div>

                    <div className="bcs-static-VersionsItem-info">
                        <time dateTime={yesterday}>
                            <ReadableTime timestamp={versionTimestamp} />
                        </time>
                        <span className="bcs-static-VersionsItem-size">{sizeUtil(3000000)}</span>
                    </div>
                </div>
            </PlainButton>
        </div>
    );
};

export default StaticVersionsItem;
