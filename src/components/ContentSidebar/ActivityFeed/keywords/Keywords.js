/**
 * @flow
 * @file Keywords components
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Info from './Info';
import messages from '../messages';

import './Keywords.scss';

function getMessageForAction(action) {
    switch (action) {
        case 'applied':
            return <FormattedMessage {...messages.keywordsApplied} />;
        default:
            return null;
    }
}

type Props = {
    action: 'applied',
    words: string
};

const Keywords = ({ action, words }: Props) => (
    <div className='box-ui-keywords'>
        <span className='box-ui-keywords-message'>{getMessageForAction(action)}</span>
        {words ? <Info words={words} /> : null}
    </div>
);

Keywords.displayName = 'Keywords';

export default Keywords;
