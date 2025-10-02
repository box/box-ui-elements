import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Logo from '../../components/logo';
import IconCloud from '../../icons/general/IconCloud';
import messages from './messages';
const InsetFilter = () => /*#__PURE__*/React.createElement("filter", {
  id: "inset-shadow"
}, /*#__PURE__*/React.createElement("feOffset", {
  dx: "0",
  dy: "1.5"
}), /*#__PURE__*/React.createElement("feGaussianBlur", {
  result: "offset-blur",
  stdDeviation: "0.5"
}), /*#__PURE__*/React.createElement("feComposite", {
  in: "SourceGraphic",
  in2: "offset-blur",
  operator: "out",
  result: "inverse"
}), /*#__PURE__*/React.createElement("feFlood", {
  floodColor: "black",
  floodOpacity: "1",
  result: "color"
}), /*#__PURE__*/React.createElement("feComposite", {
  in: "color",
  in2: "inverse",
  operator: "in",
  result: "shadow"
}), /*#__PURE__*/React.createElement("feComposite", {
  in: "shadow",
  in2: "SourceGraphic",
  operator: "over"
}));
const DropCloud = ({
  className,
  cloudSize,
  position
}) => {
  const {
    x,
    y
  } = position;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('bdl-DropCloud', className),
    style: {
      top: `${y}px`,
      left: `${x}px`
    }
  }, /*#__PURE__*/React.createElement(IconCloud, {
    filter: {
      id: 'inset-shadow',
      definition: /*#__PURE__*/React.createElement(InsetFilter, null)
    },
    height: cloudSize,
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.target),
    width: cloudSize
  }), /*#__PURE__*/React.createElement(Logo, {
    title: "Box"
  }));
};
DropCloud.displayName = 'DropCloud';
DropCloud.propTypes = {
  className: PropTypes.string,
  cloudSize: PropTypes.number,
  intl: PropTypes.any,
  position: PropTypes.objectOf(PropTypes.number).isRequired
};

// Actual export
export default DropCloud;
//# sourceMappingURL=DropCloud.js.map