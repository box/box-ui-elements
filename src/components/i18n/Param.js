// @flow
import * as React from 'react';

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
        switch (typeof this.props.value) {
            default:
            case 'undefined':
                return '';

            case 'boolean':
            case 'number':
                return String(this.props.value);

            case 'function':
                return this.props.value();

            case 'object':
                if (this.props.value === null) {
                    return '';
                }
                if (React.isValidElement(this.props.value)) {
                    return this.props.value;
                }
                return this.props.value.toString();
        }
    }

    render() {
        if ((process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') && !this.props.description) {
            throw new Error('The description property is required on a Param component.');
        }
        return this.getValue();
    }
}

export default Param;
