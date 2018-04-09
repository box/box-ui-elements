/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../../messages';
import SidebarSection from '../SidebarSection';
import { isValidSkillsCard } from './skillUtils';
import type { SkillCards, SkillCard, MetadataType, MaskError } from '../../../flowTypes';
import SidebarSkillsCard from './SidebarSkillsCard';

type Props = {
    metadata?: MetadataType,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function
};

/**
 * Parses a skil error into a MaskError
 * @param {*} error
 */
const getMaskErrorFromErrorCode = (errorCode?: string): ?MaskError => {
    if (!errorCode) {
        return null;
    }

    let maskError;

    switch (errorCode) {
        case 'skills_unauthorized_request_error':
            maskError = {
                errorHeader: messages.skillDefaultError,
                errorSubHeader: messages.skillUnuthorizedError
            };
            break;
        case 'skills_forbidden_request_error':
            maskError = {
                errorHeader: messages.skillDefaultError,
                errorSubHeader: messages.skillForbiddenError
            };
            break;
        case 'skills_invalid_request_error':
        case 'skills_not_found_error':
        case 'skills_internal_server_error':
        case 'skills_unknown_error':
        default:
            maskError = {
                errorHeader: messages.skillDefaultError
            };
    }

    return maskError;
};

const SidebarSkills = ({ metadata, getPreviewer, rootElement, appElement, onInteraction }: Props) => {
    // $FlowFixMe
    const { cards }: SkillCards = metadata.global.boxSkillsCards;
    const validCards: Array<SkillCard> = cards.filter((card: SkillCard) => isValidSkillsCard(card));

    return validCards.map((card: SkillCard, index) => {
        const maskError = getMaskErrorFromErrorCode(card.error);
        const errorObj = maskError
            ? {
                maskError
            }
            : {};

        const cardProps = {
            skill: { card },
            getPreviewer: { getPreviewer },
            rootElement: { rootElement },
            appElement: { appElement },
            onInteraction: { onInteraction },
            ...errorObj
        };

        /* eslint-disable react/no-array-index-key */
        return (
            <SidebarSection
                key={index}
                title={card.title || <FormattedMessage {...messages[`${card.skill_card_type}Skill`]} />}
            >
                <SidebarSkillsCard {...cardProps} />
            </SidebarSection>
            /* eslint-enable react/no-array-index-key */
        );
    });
};

export default SidebarSkills;
