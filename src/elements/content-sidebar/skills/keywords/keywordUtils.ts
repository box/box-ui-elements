import { Pill } from './types';
import { SkillCardEntry } from '../../../../common/types/skills';

const getPills = (keywords: Array<SkillCardEntry> = []): Array<Pill> =>
    keywords.map(
        (keyword: SkillCardEntry, index: number): Pill => ({
            displayText: keyword.text as string,
            value: index,
        }),
    );

export default getPills;
