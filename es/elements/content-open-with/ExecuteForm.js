/**
 * 
 * @file Form to invoke an integration via POST
 * @author Box
 */

import React, { PureComponent } from 'react';
import { HTTP_POST } from '../../constants';
class ExecuteForm extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = /*#__PURE__*/React.createRef();
  }
  componentDidMount() {
    const {
      onSubmit
    } = this.props;
    this.ref.current.submit();
    onSubmit();
  }
  render() {
    const {
      executePostData: {
        url,
        params
      },
      id,
      windowName
    } = this.props;
    return /*#__PURE__*/React.createElement("form", {
      ref: this.ref,
      action: url,
      id: `bcow-execute-form-${id}`,
      method: HTTP_POST,
      rel: "noreferrer noopener",
      target: windowName || '_blank'
    }, params && params.map(({
      key,
      value
    }) => /*#__PURE__*/React.createElement("input", {
      key: key,
      name: key,
      type: "hidden",
      value: value
    })));
  }
}
export default ExecuteForm;
//# sourceMappingURL=ExecuteForm.js.map