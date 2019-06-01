// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Tooltip from '../../components/tooltip';
import messages from './messages';
import './Classification.scss';

type Props = {
    advisoryMessage?: string,
    isMessageInline?: boolean,
    name: string,
};

const Classification = ({ advisoryMessage, isMessageInline = true, name }: Props) => {
    const hasMessage = !!advisoryMessage;
    const isTooltipEnabled = hasMessage && !isMessageInline;
    const message = hasMessage ? (
        advisoryMessage
    ) : (
        <span className="bdl-Classification-unclassifiedMessage">
            <FormattedMessage {...messages.missingClassificationMessage} />
        </span>
    );

    return (
        <article className="bdl-Classification">
            {hasMessage && (
                <Tooltip isDisabled={!isTooltipEnabled} position="bottom-center" text={advisoryMessage}>
                    <h1 className="bdl-Classification-badge">{name}</h1>
                </Tooltip>
            )}
            {isMessageInline && <p className="bdl-Classification-advisoryMessage">{message}</p>}
        </article>
    );
};

export default Classification;
