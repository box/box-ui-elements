/**
 * @flow
 * @file Keywords components
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from 'elements/common/messages';
import Info from './Info';

import './Keywords.scss';

function getMessageForAction(action: string): React.Node {
    switch (action) {
        case 'applied':
            return <FormattedMessage {...messages.keywordsApplied} />;
        default:
            return null;
    }
}

type Props = {
    action: string | 'applied',
    words: string,
};

const Keywords = ({ action, words }: Props): React.Node => (
    <div className="bcs-keywords">
        <span className="bcs-keywords-message">{getMessageForAction(action)}</span>
        {words ? <Info words={words} /> : null}
    </div>
);

export default Keywords;
