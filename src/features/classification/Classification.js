// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Label from '../../components/label/Label';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import ClassifiedBadge from './ClassifiedBadge';
import SecurityControls from './security-controls';
import messages from './messages';
import './Classification.scss';

import type { Controls, ControlsFormat } from './flowTypes';

const STYLE_INLINE: 'inline' = 'inline';
const STYLE_TOOLTIP: 'tooltip' = 'tooltip';

type Props = {
    className?: string,
    controls?: Controls,
    controlsFormat?: ControlsFormat,
    definition?: string,
    fillColor?: string,
    isLoadingControls?: boolean,
    itemName?: string,
    maxAppCount?: number,
    messageStyle?: typeof STYLE_INLINE | typeof STYLE_TOOLTIP,
    name?: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    strokeColor?: string,
};

const Classification = ({
    definition,
    className = '',
    controls,
    controlsFormat,
    isLoadingControls,
    maxAppCount,
    messageStyle,
    name,
    itemName = '',
    fillColor,
    strokeColor,
    onClick,
}: Props) => {
    const isClassified = !!name;
    const hasDefinition = !!definition;
    const hasSecurityControls = !!controls;
    const isTooltipMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_TOOLTIP;
    const isInlineMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_INLINE;
    const isNotClassifiedMessageVisible = !isClassified && messageStyle === STYLE_INLINE;
    const isControlsIndicatorEnabled = isClassified && isLoadingControls && messageStyle === STYLE_INLINE;
    const isSecurityControlsEnabled =
        isClassified && !isLoadingControls && hasSecurityControls && messageStyle === STYLE_INLINE;

    return (
        <article className={`bdl-Classification ${className}`}>
            {isClassified && (
                <ClassifiedBadge
                    fillColor={fillColor}
                    strokeColor={strokeColor}
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
            {isSecurityControlsEnabled && (
                <SecurityControls
                    classificationName={name}
                    controls={controls}
                    controlsFormat={controlsFormat}
                    definition={definition}
                    itemName={itemName}
                    maxAppCount={maxAppCount}
                    fillColor={fillColor}
                    strokeColor={strokeColor}
                />
            )}
            {isControlsIndicatorEnabled && <LoadingIndicator />}
        </article>
    );
};

export { STYLE_INLINE, STYLE_TOOLTIP };
export default Classification;
