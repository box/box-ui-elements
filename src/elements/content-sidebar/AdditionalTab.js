/**
 * @flow
 * @file Preview sidebar additional tab component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import Tooltip from '../common/Tooltip';
import PlainButton from '../../components/plain-button/PlainButton';
import IconEllipsis from '../../icons/general/IconEllipsis';

import './AdditionalTab.scss';

const AdditionalTabComponent = ({ callback: callbackFn = noop, iconUrl, id, title, ...rest }: AdditionalTab) => {
    return (
        <Tooltip position="middle-left" text={title}>
            <PlainButton
                className="bcs-additional-tab-btn bcs-nav-btn"
                type="button"
                onClick={() => callbackFn(id, { callbackData: rest })}
            >
                {id > 0 && iconUrl ? (
                    <img className="bcs-additional-tab-icon" src={iconUrl} alt={title} />
                ) : (
                    <IconEllipsis className="bcs-additional-tab-more-icon" />
                )}
            </PlainButton>
        </Tooltip>
    );
};

export default AdditionalTabComponent;
