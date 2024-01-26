import * as React from 'react';

import Button from '../../../components/button';
import RereshIcon from './RereshIcon';

type Props = {
    onClick: () => void;
};

const Error = ({ onClick }: Props) => (
    <div className="docgen-error-state">
        <RereshIcon className="docgen-error-state--icon" />
        <div>We couldn`&apost load the tags</div>
        <p>Please refresh the list.</p>
        <Button onClick={onClick}>Refresh</Button>
    </div>
);

export default Error;
