import * as React from 'react';

import {
    JSTYPE_BOOLEAN,
    JSTYPE_FUNCTION,
    JSTYPE_NUMBER,
    JSTYPE_OBJECT,
    JSTYPE_STRING,
    JSTYPE_UNDEFINED,
} from './constants';

export interface ParamProps {
    /** A description of this parameter to help translators understand its meaning */
    description: string;
    /** The value of this parameter */
    value: unknown;
}

/**
 * Renders a replacement parameter value inside FormattedCompMessage.
 * Children are not supported.
 *
 * @example
 * <pre>
 *   <FormattedCompMessage id="x" description="y">
 *     The file <Param value={filelist[i].path} description="Name of the file that was deleted."/> has been deleted.
 *   </FormattedCompMessage>
 * </pre>
 */
const Param = ({ value }: ParamProps): React.ReactNode => {
    switch (typeof value) {
        case JSTYPE_BOOLEAN:
        case JSTYPE_NUMBER:
            return String(value);

        case JSTYPE_FUNCTION:
            return (value as () => React.ReactNode)();

        case JSTYPE_STRING:
            return value as string;

        case JSTYPE_OBJECT:
            if (value === null) {
                return '';
            }

            if (React.isValidElement(value)) {
                return value;
            }

            return value.toString();
        case JSTYPE_UNDEFINED:
        default:
            return '';
    }
};

export default Param;
