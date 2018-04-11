/**
 * @flow
 * @file Keywords components
 */

import React from 'react';
import type { Node } from 'react';
import { FormattedMessage } from 'react-intl';

import Info from './Info';
import messages from '../../../messages';

import './Keywords.scss';

function getMessageForAction(action: string): Node {
    switch (action) {
        case 'applied':
            return <FormattedMessage {...messages.keywordsApplied} />;
        default:
            return null;
    }
}

type Props = {
    action: string | 'applied',
    words: string
};

const Keywords = ({ action, words }: Props): Node => (
    <div className='bcs-keywords'>
        <span className='bcs-keywords-message'>{getMessageForAction(action)}</span>
        {words ? <Info words={words} /> : null}
    </div>
);

Keywords.displayName = 'Keywords';

export default Keywords;
