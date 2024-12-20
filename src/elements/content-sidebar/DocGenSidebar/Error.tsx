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
        <p className="bcs-DocGen-error-state--message">
            <FormattedMessage {...messages.errorCouldNotLoad} />
        </p>
        <Button onClick={onClick}>
            <FormattedMessage {...messages.errorRefreshButton} />
        </Button>
    </div>
);

export default Error;
