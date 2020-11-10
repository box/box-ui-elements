// @flow
import { List } from 'immutable';
import type { SelectOptionProp, SelectOptionValueProp } from '../select-field/props';
import { PILL_VARIANT_DEFAULT, PILL_VARIANT_WARNING, PILL_VARIANT_WAIVED } from './constants';

export type Option = SelectOptionProp;
export type OptionValue = SelectOptionValueProp;
export type SelectedOptions = Array<Option> | List<Option>;

export type SuggestedPill = {
    email: string,
    id: number,
    name: string,
    text?: string,
    type?: string,
    value?: string,
};

export type RoundPillVariant = typeof PILL_VARIANT_DEFAULT | typeof PILL_VARIANT_WARNING | typeof PILL_VARIANT_WAIVED;

export type RoundOption = {
    hasWarning: boolean,
    id?: number | string,
    isExternalUser: boolean,
} & Option;

export type SelectedRoundOptions = Array<RoundOption> | List<RoundOption>;

export type SuggestedPills = Array<SuggestedPill>;

export type SuggestedPillsFilter = $Keys<SuggestedPill>;
