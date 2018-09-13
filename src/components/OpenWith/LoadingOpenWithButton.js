/**
 * @flow
 * @file Open With button when loading
 * @author Box
 */

import * as React from 'react';
import Button from 'box-react-ui/lib/components/button/Button';
import IconFileDefault from 'box-react-ui/lib/icons/file/IconFileDefault';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';

const LoadingOpenWithButton = () => {
    return (
        <Button isDisabled>
            <IconFileDefault height={26} width={26} />
            <FormattedMessage {...messages.open} />
        </Button>
    );
};

export default injectIntl(LoadingOpenWithButton);
