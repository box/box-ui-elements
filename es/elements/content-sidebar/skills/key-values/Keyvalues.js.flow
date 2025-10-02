/**
 * @flow
 * @file File Key Values Skill Data component
 * @author Box
 */

import * as React from 'react';

import type { SkillCardEntry, SkillCard } from '../../../../common/types/skills';

import './Keyvalues.scss';

type Props = {
    card: SkillCard,
};

const Keyvalues = ({ card: { entries } }: Props) => (
    <div className="be-keyvalues">
        {Array.isArray(entries) &&
            entries.map(
                ({ label, text }: SkillCardEntry, index) =>
                    !!label &&
                    !!text && (
                        /* eslint-disable react/no-array-index-key */
                        <dl key={index} className="be-keyvalue">
                            <dt>{label}</dt>
                            <dd>{text}</dd>
                        </dl>
                    ),
                /* eslint-enable react/no-array-index-key */
            )}
    </div>
);

export default Keyvalues;
