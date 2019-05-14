// @flow
import { List } from 'immutable';

import type { PillOption } from '../pill-cloud/PillCloud';
import type { SelectOptionProp, SelectOptionValueProp } from '../select-field/props';

export type Pill = PillOption;
export type Option = SelectOptionProp;
export type OptionValue = SelectOptionValueProp;

export type SelectedPills = Array<PillOption> | List<PillOption>;

export type SuggestedPill = {
    email: string,
    id: number,
    name: string,
    text?: string,
    type?: string,
    value?: string,
};

export type SuggestedPills = Array<SuggestedPill>;

export type SuggestedPillsFilter = $Keys<SuggestedPill>;
