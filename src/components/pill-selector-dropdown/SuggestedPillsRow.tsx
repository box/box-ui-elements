import * as React from 'react';
import noop from 'lodash/noop';

import SuggestedPill from './SuggestedPill';
import type { SuggestedPill as SuggestedPillType, SuggestedPills, SuggestedPillsFilter } from './flowTypes';

import './SuggestedPillsRow.scss';

export interface SuggestedPillsRowProps {
    /** Called when a suggested pill is added */
    onSuggestedPillAdd?: (suggestedPill: SuggestedPillType) => void;
    /** Values of already selected pills used to hide matching suggestions */
    selectedPillsValues?: Array<string | number>;
    /** Suggested pills to show */
    suggestedPillsData?: SuggestedPills;
    /** Suggested-pill field used to match against selectedPillsValues */
    suggestedPillsFilter?: SuggestedPillsFilter;
    /** Label shown before the suggested pills */
    title?: string;
}

const SuggestedPillsRow = ({
    onSuggestedPillAdd = noop,
    selectedPillsValues = [],
    suggestedPillsData = [],
    suggestedPillsFilter = 'id',
    title,
}: SuggestedPillsRowProps) => {
    // Prevents pills from being rendered that are in the form by checking for value (id or custom value)
    const filteredSuggestedPillData = suggestedPillsData.filter(item => {
        const filterValue = item[suggestedPillsFilter];
        return filterValue === undefined || !selectedPillsValues.includes(filterValue);
    });

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
