// @flow
import * as React from 'react';

import isDevEnvironment from '../../utils/env';
import {
    JSTYPE_BOOLEAN,
    JSTYPE_FUNCTION,
    JSTYPE_NUMBER,
    JSTYPE_OBJECT,
    JSTYPE_STRING,
    JSTYPE_UNDEFINED,
} from '../../constants';

type Props = {
    /** The value of this parameter */
    description: string,

    /** A description of this parameter to help the translators understand what it is */
    value: any,
};

/**
 * @class A placeholder for a replacement parameter in the body of a FormattedCompMessage
 * component.
 *
 * This component renders into the value of the named parameter to the FormattedCompMessage
 * component. Typically, this component is self-closing.
 *
 * @example
 * <pre>
 *   <FormattedCompMessage id="x" description="y">
 *     The file <Param value={filelist[i].path} description="Name of the file that was deleted."/> has been deleted.
 *   </FormattedCompMessage>
 * </pre>
 */
class Param extends React.Component<Props> {
    getValue() {
        const { value } = this.props;
        switch (typeof value) {
            default:
            case JSTYPE_UNDEFINED:
                return '';

            case JSTYPE_BOOLEAN:
            case JSTYPE_NUMBER:
                return String(value);

            case JSTYPE_FUNCTION:
                return value();

            case JSTYPE_STRING:
                return value;

            case JSTYPE_OBJECT:
                if (value === null) {
                    return '';
                }
                if (React.isValidElement(value)) {
                    return value;
                }
                return value.toString();
        }
    }

    render() {
        if (isDevEnvironment() && !this.props.description) {
            throw new Error('The description property is required on a Param component.');
        }
        return this.getValue();
    }
}

export default Param;
