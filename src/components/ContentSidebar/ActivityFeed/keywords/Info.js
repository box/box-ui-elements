/**
 * @flow
 * @file Info component used by Keywords component
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import IconInfoInverted from 'box-react-ui/lib/icons/general/IconInfoInverted';
import Tooltip from 'box-react-ui/lib/components/tooltip';

import messages from '../messages';

type Props = {
    words: PropTypes.string
};

const Info = ({ words }: Props) => (
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

export default Info;
