/**
 * @flow
 * @file Sort Button component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import Button from '../../../components/button';
import IconSort from '../../../icons/general/IconSort';
import Tooltip from '../Tooltip';
import { bdlGray65 } from '../../../styles/variables';

import messages from '../messages';

import './SortButton.scss';

type Props = {
    intl: IntlShape,
};

const SortButton = ({ intl, ...rest }: Props) => {
    const sortMessage = intl.formatMessage(messages.sort);
    return (
        <Tooltip text={sortMessage}>
            <Button aria-label={sortMessage} className="be-btn-sort" type="button" {...rest}>
                <IconSort color={bdlGray65} />
            </Button>
        </Tooltip>
    );
};

export { SortButton as SortButtonBase };
export default injectIntl(SortButton);
