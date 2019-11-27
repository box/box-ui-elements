// @flow
import { SKILLS_KEYWORD, SKILLS_TIMELINE, SKILLS_TRANSCRIPT, SKILLS_FACE, SKILLS_STATUS } from '../../constants';
import type { BoxItemVersion } from './core';

type SkillCardType =
    | typeof SKILLS_KEYWORD
    | typeof SKILLS_TIMELINE
    | typeof SKILLS_TRANSCRIPT
    | typeof SKILLS_FACE
    | typeof SKILLS_STATUS;

type SkillCardEntryType = 'text' | 'image';

type SkillCardLocalizableType = {
    code?: string,
    message?: string,
};

type SkillCardEntryTimeSlice = {
    end?: number,
    start: number,
};

type SkillCardEntry = {
    appears?: Array<SkillCardEntryTimeSlice>,
    image_url?: string,
    label?: string,
    text?: string,
    type?: SkillCardEntryType,
};

type SkillCard = {
    duration?: number,
    entries: Array<SkillCardEntry>,
    error?: string,
    file_version: BoxItemVersion,
    id?: string,
    skill_card_title: SkillCardLocalizableType,
    skill_card_type: SkillCardType,
    status?: SkillCardLocalizableType,
    title?: string,
    type: 'skill_card',
};

type SkillCards = {
    cards: Array<SkillCard>,
};

export type {
    SkillCardEntryType,
    SkillCardLocalizableType,
    SkillCardEntryTimeSlice,
    SkillCardEntry,
    SkillCard,
    SkillCards,
};
