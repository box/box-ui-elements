import * as React from 'react';
import { JSTYPE_BOOLEAN, JSTYPE_FUNCTION, JSTYPE_NUMBER, JSTYPE_OBJECT, JSTYPE_STRING, JSTYPE_UNDEFINED } from './constants';
/**
 * @class A placeholder for a replacement parameter in the body of a FormattedCompMessage
 * component.
 *
 * This component renders into the value of the named parameter to the FormattedCompMessage
 * component. Children are not allowed in this component and typically, it is used with
 * the self-closing syntax.
 *
 * @example
 * <pre>
 *   <FormattedCompMessage id="x" description="y">
 *     The file <Param value={filelist[i].path} description="Name of the file that was deleted."/> has been deleted.
 *   </FormattedCompMessage>
 * </pre>
 */
const Param = ({
  value
}) => {
  switch (typeof value) {
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
      if (/*#__PURE__*/React.isValidElement(value)) {
        return value;
      }
      return value.toString();
    case JSTYPE_UNDEFINED:
    default:
      return '';
  }
};
export default Param;
//# sourceMappingURL=Param.js.map