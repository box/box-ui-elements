// @flow
import * as React from 'react';
import noop from 'lodash/noop';

import SuggestedPill from './SuggestedPill';
import type { SuggestedPill as SuggestedPillType, SuggestedPills, SuggestedPillsFilter } from './flowTypes';

import './SuggestedPillsRow.scss';

type Props = {
    onSuggestedPillAdd?: SuggestedPillType => void,
    selectedPillsValues?: Array<number>,
    suggestedPillsData?: SuggestedPills,
    suggestedPillsFilter?: SuggestedPillsFilter,
    title?: string,
};

const SuggestedPillsRow = ({
    onSuggestedPillAdd = noop,
    selectedPillsValues = [],
    suggestedPillsData = [],
    suggestedPillsFilter = 'id',
    title,
}: Props) => {
    // Prevents pills from being rendered that are in the form by checking for value (id or custom value)
    const filteredSuggestedPillData = suggestedPillsData.filter(
        item => !selectedPillsValues.includes(item[suggestedPillsFilter]),
    );

    if (filteredSuggestedPillData.length === 0) {
        return null;
    }

    return (
        <div className="pill-selector-suggested">
            <span>{title}</span>
            {filteredSuggestedPillData.map(item => (
                <SuggestedPill
                    key={item.id}
                    email={item.email}
                    id={item.id}
                    name={item.name}
                    onAdd={onSuggestedPillAdd}
                />
            ))}
        </div>
    );
};

export default SuggestedPillsRow;
