// @flow
import { List } from 'immutable';

import type { PillOption } from 'components/pill-cloud/PillCloud';

export type SelectedOptions = Array<PillOption> | List<PillOption>;

export type SuggestedPill = {
    email: string,
    id: number,
    name: string,
    text?: string,
    type?: string,
    value?: string,
};

export type SuggestedPills = Array<SuggestedPill>;
