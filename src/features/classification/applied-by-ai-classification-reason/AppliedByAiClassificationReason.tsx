import React from 'react';
import { AnswerContent, References } from '@box/box-ai-content-answers';
import { Card, Text } from '@box/blueprint-web';
import BoxAIIconColor from '@box/blueprint-web-assets/icons/Logo/BoxAiLogo';
import { Size5 } from '@box/blueprint-web-assets/tokens/tokens';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { isValidDate } from '../../../utils/datetime';
import type { AiClassificationReason } from '../types';

import messages from './messages';

import './AppliedByAiClassificationReason.scss';

const AppliedByAiClassificationReason = ({ answer, modifiedAt, citations }: AiClassificationReason) => {
    const modifiedDate = new Date(modifiedAt);
    const isModifiedDateAvailable = Boolean(modifiedAt) && isValidDate(modifiedDate);

    const formattedModifiedAt = isModifiedDateAvailable && (
        <FormattedDate value={modifiedDate} month="long" year="numeric" day="numeric" />
    );

    return (
        <Card className="AppliedByAiClassificationReason">
            <h3 className="AppliedByAiClassificationReason-header">
                <BoxAIIconColor data-testid="box-ai-icon" height={Size5} width={Size5} />
                <Text
                    className="AppliedByAiClassificationReason-headerText"
                    as="span"
                    color="textOnLightSecondary"
                    variant="bodyDefaultSemibold"
                >
                    {isModifiedDateAvailable ? (
                        <FormattedMessage
                            {...messages.appliedByBoxAiOnDate}
                            values={{ modifiedAt: formattedModifiedAt }}
                        />
                    ) : (
                        <FormattedMessage {...messages.appliedByBoxAi} />
                    )}
                </Text>
            </h3>
            <AnswerContent className="AppliedByAiClassificationReason-answer" answer={answer} />
            {citations && (
                <div className="AppliedByAiClassificationReason-references">
                    <References citations={citations} />
                </div>
            )}
        </Card>
    );
};

export default AppliedByAiClassificationReason;
