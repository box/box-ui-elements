// @flow
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { isValidDate } from '../../utils/datetime';
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
    color?: string,
    controls?: Controls,
    controlsFormat?: ControlsFormat,
    definition?: string,
    isLoadingControls?: boolean,
    itemName?: string,
    maxAppCount?: number,
    messageStyle?: typeof STYLE_INLINE | typeof STYLE_TOOLTIP,
    modifiedAt?: string,
    modifiedBy?: string,
    name?: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
};

const Classification = ({
    definition,
    className = '',
    controls,
    controlsFormat,
    isLoadingControls,
    maxAppCount,
    messageStyle,
    modifiedAt,
    modifiedBy,
    name,
    itemName = '',
    color,
    onClick,
}: Props) => {
    const isClassified = !!name;
    const hasDefinition = !!definition;
    const hasModifiedAt = !!modifiedAt;
    const hasModifiedBy = !!modifiedBy;
    const hasSecurityControls = !!controls;
    const isTooltipMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_TOOLTIP;
    const isInlineMessageEnabled = isClassified && hasDefinition && messageStyle === STYLE_INLINE;
    const isNotClassifiedMessageVisible = !isClassified && messageStyle === STYLE_INLINE;
    const isControlsIndicatorEnabled = isClassified && isLoadingControls && messageStyle === STYLE_INLINE;
    const isSecurityControlsEnabled =
        isClassified && !isLoadingControls && hasSecurityControls && messageStyle === STYLE_INLINE;
    const modifiedDate = new Date(modifiedAt || 0);
    const isModifiedMessageVisible =
        isClassified && hasModifiedAt && isValidDate(modifiedDate) && hasModifiedBy && messageStyle === STYLE_INLINE;

    const formattedModifiedAt = isModifiedMessageVisible && (
        <FormattedDate value={modifiedDate} month="long" year="numeric" day="numeric" />
    );

    return (
        <article className={`bdl-Classification ${className}`}>
            {isClassified && (
                <ClassifiedBadge
                    color={color}
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
            {isModifiedMessageVisible && (
                <Label text={<FormattedMessage {...messages.modifiedByLabel} />}>
                    <p className="bdl-Classification-modifiedBy" data-testid="classification-modifiedby">
                        <FormattedMessage
                            {...messages.modifiedBy}
                            values={{ modifiedAt: formattedModifiedAt, modifiedBy }}
                        />
                    </p>
                </Label>
            )}

            {isSecurityControlsEnabled && (
                <SecurityControls
                    classificationColor={color}
                    classificationName={name}
                    controls={controls}
                    controlsFormat={controlsFormat}
                    definition={definition}
                    itemName={itemName}
                    maxAppCount={maxAppCount}
                    shouldRenderLabel
                />
            )}
            {isControlsIndicatorEnabled && <LoadingIndicator />}
        </article>
    );
};

export { STYLE_INLINE, STYLE_TOOLTIP };
export default Classification;
