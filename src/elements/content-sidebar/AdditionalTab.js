/**
 * @flow
 * @file Preview sidebar additional tab component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import Tooltip from '../common/Tooltip';
import PlainButton from '../../components/plain-button/PlainButton';

const AdditionalTab = ({ callback: callbackFn = noop, element, id, title }: AdditionalTab) => {
    return (
        <Tooltip position="middle-left" text={title}>
            <PlainButton className="bcs-additional-tab-btn bcs-nav-btn" type="button" onClick={() => callbackFn(id)}>
                {element}
            </PlainButton>
        </Tooltip>
    );
};

export default AdditionalTab;
