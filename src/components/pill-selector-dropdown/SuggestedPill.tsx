import * as React from 'react';

import { ButtonType } from '../button';
import PlainButton from '../plain-button';
import Tooltip, { TooltipPosition } from '../tooltip';
import { KEYS } from '../../constants';

import { type SuggestedPill as SuggestedPillType } from './flowTypes';

import './SuggestedPillsRow.scss';

export interface SuggestedPillProps {
    /** Email address shown in the tooltip and used as the added pill value */
    email: string;
    /** Unique identifier for the suggested pill */
    id: number;
    /** Display name shown on the suggested pill */
    name: string;
    /** Called with the suggested pill payload when the user adds it */
    onAdd: (suggestedPill: SuggestedPillType) => void;
}

const SuggestedPill = ({ email, id, name, onAdd }: SuggestedPillProps) => {
    const addSuggestedPill = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();

        // TODO: refactor this so inline conversions aren't required at every usage
        onAdd({
            email,
            id,
            name,
            text: name,
            type: 'user',
            value: email,
        });
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === KEYS.enter) {
            addSuggestedPill(event);
        }
    };

    return (
        <Tooltip position={TooltipPosition.BOTTOM_CENTER} text={email}>
            <PlainButton
                className="suggested-pill-invisible-button"
                onClick={addSuggestedPill}
                onKeyDown={handleKeyPress}
                type={ButtonType.BUTTON}
            >
                <span className="bdl-Pill-text pill-text suggested-pill">{name}</span>
            </PlainButton>
        </Tooltip>
    );
};

export default SuggestedPill;
