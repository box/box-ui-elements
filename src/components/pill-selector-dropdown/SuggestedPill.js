// @flow
import React from 'react';

import PlainButton from '../plain-button';
import Tooltip from '../tooltip';
import { type SuggestedPill as SuggestedPillType } from './flowTypes';

import './SuggestedPillsRow.scss';

type Props = {
    email: string,
    id: number,
    name: string,
    onAdd: SuggestedPillType => void,
};

const SuggestedPill = ({ email, id, name, onAdd }: Props) => {
    const addSuggestedPill = (event: SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault();

        onAdd({
            email,
            id,
            name,
            text: name,
            type: 'user',
            value: email,
        });
    };

    const handleKeyPress = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter') {
            addSuggestedPill(event);
        }
    };

    return (
        <Tooltip position="bottom-center" text={email}>
            <PlainButton className="invisible-button" onClick={addSuggestedPill} onKeyDown={handleKeyPress}>
                <span className="pill-text suggested-pill">{name}</span>
            </PlainButton>
        </Tooltip>
    );
};

export default SuggestedPill;
