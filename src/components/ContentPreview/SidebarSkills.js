/**
 * @flow
 * @file Details sidebar component
 * @author Box
 */

import React from 'react';
import SidebarSection from './SidebarSection';
import Keywords from '../Keywords';
import Transcript from '../Transcript';
import Timelines from '../Timeline';
import type { SkillData, MetadataType } from '../../flowTypes';

type Props = {
    metadata?: MetadataType,
    getPreviewer: Function,
    getLocalizedMessage: Function
};

function getCard(skill: SkillData, getPreviewer: Function) {
    const { skills_data_type } = skill;
    switch (skills_data_type) {
        case 'keyword':
            return <Keywords skill={skill} getPreviewer={getPreviewer} />;
        case 'timeline':
            return <Timelines skill={skill} getPreviewer={getPreviewer} />;
        case 'transcript':
            return <Transcript skill={skill} getPreviewer={getPreviewer} />;
        default:
            return null;
    }
}

const SidebarSkills = ({ metadata, getPreviewer, getLocalizedMessage }: Props) => {
    if (!metadata || !metadata.global) {
        return null;
    }

    let skills: SkillData[] = [];
    const keywords = metadata.global['box-skills-keywords-demo'];
    const timelines = metadata.global['box-skills-timelines-demo'];
    const transcripts = metadata.global['box-skills-transcripts-demo'];

    if (keywords) {
        try {
            skills = skills.concat(JSON.parse(keywords.keywords));
        } catch (e) {
            // ignore
        }
    }

    if (timelines) {
        try {
            skills = skills.concat(JSON.parse(timelines.timelines));
        } catch (e) {
            // ignore
        }
    }

    if (transcripts) {
        try {
            skills = skills.concat(JSON.parse(transcripts.transcripts));
        } catch (e) {
            // ignore
        }
    }

    if (skills.length === 0) {
        return null;
    }

    return (
        <div>
            {skills.map(
                (skill: SkillData, index) =>
                    /* eslint-disable react/no-array-index-key */
                    <SidebarSection
                        key={index}
                        title={
                            skill.title || getLocalizedMessage(`buik.preview.sidebar.details.${skill.skills_data_type}`)
                        }
                    >
                        {getCard(skill, getPreviewer)}
                    </SidebarSection>
                /* eslint-enable react/no-array-index-key */
            )}
        </div>
    );
};

export default SidebarSkills;
