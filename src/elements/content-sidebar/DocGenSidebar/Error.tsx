import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../components/button';
import messages from './messages';
import RefreshIcon from './RefreshIcon';

type Props = {
    onClick: () => void;
};

const Error = ({ onClick }: Props) => (
    <div className="bcs-DocGen-error-state" data-testid="docgen-sidebar-error">
        <RefreshIcon className="bcs-DocGen-error-state--icon" />
        <div>
            <FormattedMessage {...messages.errorCouldNotLoad} />
        </div>
        <p>
            <FormattedMessage {...messages.errorRefreshList} />
        </p>
        <Button onClick={onClick}>
            <FormattedMessage {...messages.errorRefreshButton} />
        </Button>
    </div>
);

export default Error;
