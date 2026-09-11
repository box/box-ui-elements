// @flow
import * as React from 'react';

import PlainButton from '../plain-button';
import Tooltip from '../tooltip';
import { KEYS } from '../../constants';

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

    const handleKeyPress = (event: SyntheticKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === KEYS.enter) {
            addSuggestedPill(event);
        }
    };

    return (
        <Tooltip position="bottom-center" text={email}>
            <PlainButton
                className="suggested-pill-invisible-button"
                onClick={addSuggestedPill}
                onKeyDown={handleKeyPress}
                type="button"
            >
                <span className="bdl-Pill-text pill-text suggested-pill">{name}</span>
            </PlainButton>
        </Tooltip>
    );
};

export default SuggestedPill;
