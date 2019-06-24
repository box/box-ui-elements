// @flow
import { VIEW_MODE_GRID, VIEW_MODE_LIST } from '../../constants';

type ViewMode = typeof VIEW_MODE_GRID | typeof VIEW_MODE_LIST;

type ErrorType = {
    code: string,
    details?: Object,
    displayMessage?: string,
    message?: string,
};

export type { ErrorType };
export type { ViewMode };
