/**
 * @flow
 * @file Preview sidebar additional tab component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import Tooltip from '../common/Tooltip';
import PlainButton from '../../components/plain-button/PlainButton';
import './AdditionalTab.scss';

const AdditionalTab = ({ callback: callbackFn = noop, iconUrl, id, title, ...rest }: AdditionalTab) => {
    return (
        <Tooltip position="middle-left" text={title}>
            <PlainButton
                className="bcs-additional-tab-btn bcs-nav-btn"
                type="button"
                onClick={() => callbackFn({ id, rest })}
            >
                <img className="bcs-additional-tab-icon" src={iconUrl} alt={title} />
            </PlainButton>
        </Tooltip>
    );
};

export default AdditionalTab;
