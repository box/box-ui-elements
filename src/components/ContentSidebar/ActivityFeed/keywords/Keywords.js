import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconInfoInverted from '../../../icons/general/IconInfoInverted';
import Tooltip from '../../../components/tooltip';

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

const Info = ({ words }) => (
    <span className='box-ui-keywords-actions'>
        <Tooltip
            className='box-ui-keywords-actions-tooltip'
            position='bottom-left'
            text={<FormattedMessage {...messages.keywordsList} values={{ words }} />}
        >
            <div className='box-ui-keywords-info'>
                <IconInfoInverted height={16} width={16} />
            </div>
        </Tooltip>
    </span>
);

Info.displayName = 'Info';

Info.propTypes = {
    words: PropTypes.string
};

const Keywords = ({ action, words }) => (
    <div className='box-ui-keywords'>
        <span className='box-ui-keywords-message'>{getMessageForAction(action)}</span>
        {words ? <Info words={words} /> : null}
    </div>
);

Keywords.displayName = 'Keywords';

Keywords.propTypes = {
    action: PropTypes.oneOf(['applied']).isRequired,
    words: PropTypes.string.isRequired
};

export default Keywords;
