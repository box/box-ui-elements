// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Tooltip from '../../components/tooltip';
import messages from './messages';
import './Classification.scss';

type Props = {
    advisoryMessage?: string,
    isMessageInline?: boolean,
    name?: string,
};

const Classification = ({ advisoryMessage, isMessageInline = true, name }: Props) => {
    const isClassified = !!name;
    const hasMessage = !!advisoryMessage;
    const isTooltipEnabled = isClassified && hasMessage && !isMessageInline;
    const isInlineMessageEnabled = isClassified && hasMessage && isMessageInline;

    return (
        <article className="bdl-Classification">
            {isClassified && (
                <Tooltip isDisabled={!isTooltipEnabled} position="bottom-center" text={advisoryMessage}>
                    <h1 className="bdl-Classification-badge">{name}</h1>
                </Tooltip>
            )}
            {isInlineMessageEnabled && <p className="bdl-Classification-advisoryMessage">{advisoryMessage}</p>}
            {!isClassified && (
                <span className="bdl-Classification-missingMessage">
                    <FormattedMessage {...messages.missing} />
                </span>
            )}
        </article>
    );
};

export default Classification;
