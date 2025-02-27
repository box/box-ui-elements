// This file contains TypeScript definitions converted from Flow types in core.js
import { DELIMITER_SLASH, DELIMITER_CARET } from '../../constants';

export type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;

export interface Crumb {
    id?: string;
    name: string;
}
