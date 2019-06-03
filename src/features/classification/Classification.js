// @flow
import * as React from 'react';

import Tooltip from '../../components/tooltip';
import './Classification.scss';

type Props = {
    advisoryMessage?: string,
    isMessageInline?: boolean,
    name: string,
};

const Classification = ({ advisoryMessage, isMessageInline = true, name }: Props) => {
    const hasMessage = !!advisoryMessage;
    const isTooltipEnabled = hasMessage && !isMessageInline;
    const isInlineMessageVisible = hasMessage && isMessageInline;
    return (
        <article className="bdl-Classification">
            <Tooltip isDisabled={!isTooltipEnabled} position="bottom-center" text={advisoryMessage}>
                <h1 className="bdl-Classification-badge">{name}</h1>
            </Tooltip>
            {isInlineMessageVisible && <p className="bdl-Classification-advisoryMessage">{advisoryMessage}</p>}
        </article>
    );
};

export default Classification;
