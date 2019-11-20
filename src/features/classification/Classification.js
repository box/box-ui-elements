// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Label from '../../components/label/Label';
import ClassifiedBadge from './ClassifiedBadge';
import SecurityControls from './security-controls';
import messages from './messages';
import './Classification.scss';

import type { SecurityControlsProps } from './security-controls';

const STYLE_INLINE: 'inline' = 'inline';
const STYLE_TOOLTIP: 'tooltip' = 'tooltip';

type Props = {
    className?: string,
    definition?: string,
    messageStyle?: typeof STYLE_INLINE | typeof STYLE_TOOLTIP,
    name?: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    securityControlsProps?: SecurityControlsProps,
};

const Classification = ({ definition, className = '', messageStyle, name, onClick, securityControlsProps }: Props) => {
    const isClassified = !!name;
    const hasDefinition = !!definition;
    const hasSecurityControls = !!securityControlsProps;
    const isTooltipMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_TOOLTIP;
    const isInlineMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_INLINE;
    const isSecurityControlsEnabled = isClassified && hasSecurityControls && messageStyle === STYLE_INLINE;
    const isNotClassifiedMessageVisible = !isClassified && messageStyle === STYLE_INLINE;

    return (
        <article className={`bdl-Classification ${className}`}>
            {isClassified && (
                <ClassifiedBadge
                    name={((name: any): string)}
                    onClick={onClick}
                    tooltipText={isTooltipMessageEnabled ? definition : undefined}
                />
            )}
            {isInlineMessageEnabled && (
                <Label text={<FormattedMessage {...messages.definition} />}>
                    <p className="bdl-Classification-definition">{definition}</p>
                </Label>
            )}
            {isNotClassifiedMessageVisible && (
                <span className="bdl-Classification-missingMessage">
                    <FormattedMessage {...messages.missing} />
                </span>
            )}
            {isSecurityControlsEnabled && <SecurityControls {...securityControlsProps} />}
        </article>
    );
};

export { STYLE_INLINE, STYLE_TOOLTIP };
export default Classification;
