// @flow
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import AppliedByAiClassificationReason from './applied-by-ai-classification-reason/AppliedByAiClassificationReason';
import ClassifiedBadge from './ClassifiedBadge';
import Label from '../../components/label/Label';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SecurityControls from './security-controls';
import { isValidDate } from '../../utils/datetime';

import messages from './messages';

import './Classification.scss';

import type { AiClassificationReason, Controls, ControlsFormat } from './flowTypes';

const STYLE_INLINE: 'inline' = 'inline';
const STYLE_TOOLTIP: 'tooltip' = 'tooltip';
type Props = {
    aiClassificationReason?: AiClassificationReason,
    className?: string,
    color?: string,
    controls?: Controls,
    controlsFormat?: ControlsFormat,
    definition?: string,
    isImportedClassification?: boolean,
    isLoadingAppliedBy?: boolean,
    isLoadingControls?: boolean,
    itemName?: string,
    maxAppCount?: number,
    messageStyle?: typeof STYLE_INLINE | typeof STYLE_TOOLTIP,
    modifiedAt?: string,
    modifiedBy?: string,
    name?: string,
    onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
    shouldDisplayAppsAsIntegrations?: boolean,
    shouldUseAppliedByLabels?: boolean,
};

const Classification = ({
    aiClassificationReason,
    className = '',
    color,
    controls,
    controlsFormat,
    definition,
    isImportedClassification = false,
    isLoadingAppliedBy = false,
    isLoadingControls,
    itemName = '',
    maxAppCount,
    messageStyle,
    modifiedAt,
    modifiedBy,
    name,
    onClick,
    shouldDisplayAppsAsIntegrations = false,
    shouldUseAppliedByLabels = false,
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
    const hasAiClassificationReason =
        messageStyle === STYLE_INLINE && isClassified && (isLoadingAppliedBy || aiClassificationReason);
    const shouldRenderModificationDetails = isModifiedMessageVisible || hasAiClassificationReason;

    const formattedModifiedAt = isModifiedMessageVisible && (
        <FormattedDate value={modifiedDate} month="long" year="numeric" day="numeric" />
    );

    const modifiedByMessage = isImportedClassification ? messages.importedBy : messages.modifiedBy;

    const modificationTitleLabel = shouldUseAppliedByLabels ? messages.appliedByTitle : messages.modifiedByLabel;

    const modifiedByDetails = shouldUseAppliedByLabels ? (
        <FormattedMessage
            {...messages.appliedByDetails}
            values={{ appliedAt: formattedModifiedAt, appliedBy: modifiedBy }}
        />
    ) : (
        <FormattedMessage {...modifiedByMessage} values={{ modifiedAt: formattedModifiedAt, modifiedBy }} />
    );

    const renderModificationDetails = () => {
        if (isLoadingAppliedBy) {
            return <LoadingIndicator />;
        }

        if (aiClassificationReason) {
            return (
                <AppliedByAiClassificationReason
                    answer={aiClassificationReason.answer}
                    citations={aiClassificationReason.citations}
                    className="bdl-Classification-appliedByAiDetails"
                    modifiedAt={aiClassificationReason.modifiedAt}
                />
            );
        }

        return (
            <p className="bdl-Classification-modifiedBy" data-testid="classification-modifiedby">
                {modifiedByDetails}
            </p>
        );
    };

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
            {shouldRenderModificationDetails && (
                <Label text={<FormattedMessage {...modificationTitleLabel} />}>{renderModificationDetails()}</Label>
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
                    shouldDisplayAppsAsIntegrations={shouldDisplayAppsAsIntegrations}
                />
            )}
            {isControlsIndicatorEnabled && <LoadingIndicator />}
        </article>
    );
};

export { STYLE_INLINE, STYLE_TOOLTIP };
export default Classification;
