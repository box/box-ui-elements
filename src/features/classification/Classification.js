// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ClassifiedBadge from './ClassifiedBadge';
import AddClassificationBadge from './AddClassificationBadge';
import messages from './messages';
import './Classification.scss';

const STYLE_INLINE: 'inline' = 'inline';
const STYLE_TOOLTIP: 'tooltip' = 'tooltip';

type Props = {
    advisoryMessage?: string,
    className?: string,
    messageStyle?: typeof STYLE_INLINE | typeof STYLE_TOOLTIP,
    name?: string,
};

const Classification = ({ advisoryMessage, className = '', messageStyle, name }: Props) => {
    const isClassified = !!name;
    const hasMessage = !!advisoryMessage;

    const isTooltipMessageEnabled = isClassified && hasMessage && messageStyle === STYLE_TOOLTIP;
    const isInlineMessageEnabled = isClassified && hasMessage && messageStyle === STYLE_INLINE;

    // Either the add classification badge should be visible or the "not classified" text or neither
    const isAddClassificationBadgeVisible = !isClassified && !messageStyle;
    const isNotClassifiedMessageVisible = !isClassified && messageStyle === STYLE_INLINE;

    return (
        <article className={`bdl-Classification ${className}`}>
            {isClassified && (
                <ClassifiedBadge
                    name={((name: any): string)}
                    tooltipText={isTooltipMessageEnabled ? advisoryMessage : undefined}
                />
            )}
            {isAddClassificationBadgeVisible && <AddClassificationBadge />}
            {isInlineMessageEnabled && <p className="bdl-Classification-advisoryMessage">{advisoryMessage}</p>}
            {isNotClassifiedMessageVisible && (
                <span className="bdl-Classification-missingMessage">
                    <FormattedMessage {...messages.missing} />
                </span>
            )}
        </article>
    );
};

export default Classification;
