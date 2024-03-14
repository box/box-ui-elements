import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../components/button';
import messages from './messages';
import RereshIcon from './RereshIcon';

type Props = {
    onClick: () => void;
};

const Error = ({ onClick }: Props) => (
    <div className="docgen-error-state">
        <RereshIcon className="docgen-error-state--icon" />
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
