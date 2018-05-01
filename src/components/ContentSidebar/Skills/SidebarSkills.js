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
import type { SkillCards, SkillCard, MetadataType } from '../../../flowTypes';
import SidebarSkillsCard from './SidebarSkillsCard';

type Props = {
    metadata?: MetadataType,
    getPreviewer: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onInteraction: Function,
    hasCustomBranding: boolean
};

const SidebarSkills = ({
    metadata,
    getPreviewer,
    rootElement,
    appElement,
    onInteraction,
    hasCustomBranding
}: Props) => {
    // $FlowFixMe
    const { cards }: SkillCards = metadata.global.boxSkillsCards;
    const validCards: Array<SkillCard> = cards.filter((card: SkillCard) => isValidSkillsCard(card));

    return validCards.map((card: SkillCard, index) => (
        /* eslint-disable react/no-array-index-key */
        <SidebarSection
            key={index}
            hasCustomBranding={hasCustomBranding}
            title={card.title || <FormattedMessage {...messages[`${card.skill_card_type}Skill`]} />}
        >
            <SidebarSkillsCard
                errorCode={card.error}
                skill={card}
                getPreviewer={getPreviewer}
                rootElement={rootElement}
                appElement={appElement}
                onInteraction={onInteraction}
            />
        </SidebarSection>
        /* eslint-enable react/no-array-index-key */
    ));
};

export default SidebarSkills;
