const _excluded = ["count", "tagName", "intl", "description", "id", "defaultMessage"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// @deprecated, use FormattedMessage from react-intl v6 instead.
import * as React from 'react';
import { injectIntl } from 'react-intl';
import isNaN from 'lodash/isNaN';
import isDevEnvironment from '../../utils/env';
import { CATEGORY_ZERO, CATEGORY_ONE, CATEGORY_TWO, CATEGORY_FEW, CATEGORY_MANY, CATEGORY_OTHER } from './constants';
import Composition from './Composition';
/**
 * Replace the text inside of this component with a translation. This
 * component is built on top of react-intl, so it works along with the
 * regular react-intl components and objects you are used to, and it gets
 * its translations from react intl as well. The FormattedCompMessage component can
 * be used wherever it is valid to put JSX text. In regular Javascript
 * code, you should continue to use the intl.formatMessage() call and
 * extract your strings into a message.js file.
 */
class FormattedCompMessage extends React.Component {
  constructor(props) {
    super(props);

    /* eslint-disable no-console */
    console.warn("box-ui-elements: the FormattedCompMessage component is deprecated! Use react-intl's FormattedMessage instead.");
    /* eslint-enable no-console */

    // these parameters echo the ones in react-intl's FormattedMessage
    // component, plus a few extra
    const {
      defaultMessage,
      // The English string + HTML + components that you want translated
      count,
      // the pivot count to choose a plural form
      children // the components within the body
    } = this.props;
    const sourceElements = defaultMessage || children;
    if (sourceElements) {
      const composition = new Composition(sourceElements);
      let source = '';
      if (!isNaN(Number(count))) {
        if (children) {
          source = this.composePluralString(children);
        } else if (isDevEnvironment()) {
          throw new Error('Cannot use count prop on a FormattedCompMessage component that has no children.');
        }
      } else {
        source = composition.compose();
      }
      this.state = {
        source,
        composition
      };
    }
  }

  /**
   * Search for any Plural elements in the children, and
   * then construct the English source string in the correct
   * format for react-intl to use for pluralization
   * @param {React.Element} children the children of this node
   * @return {string} the composed plural string
   */
  composePluralString(children) {
    const categories = {};
    React.Children.forEach(children, child => {
      if (typeof child === 'object' && /*#__PURE__*/React.isValidElement(child) && child.type.name === 'Plural') {
        const childComposition = new Composition(child.props.children);
        categories[child.props.category] = childComposition.compose();
      }
    });
    if (!categories.one || !categories.other) {
      if (isDevEnvironment()) {
        throw new Error('Cannot use count prop on a FormattedCompMessage component without giving both a "one" and "other" Plural component in the children.');
      }
    }
    // add these to the string in a particular order so that
    // we always end up with the same string regardless of
    // the order that the Plural elements were specified in
    // the source code
    const categoriesString = [CATEGORY_ZERO, CATEGORY_ONE, CATEGORY_TWO, CATEGORY_FEW, CATEGORY_MANY, CATEGORY_OTHER].map(category => categories[category] ? ` ${category} {${categories[category]}}` : '').join('');

    // see the intl-messageformat project for an explanation of this syntax
    return `{count, plural,${categoriesString}}`;
  }
  render() {
    const _this$props = this.props,
      {
        count,
        tagName,
        intl,
        description,
        id,
        defaultMessage
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      composition,
      source
    } = this.state;
    const values = {};
    if (typeof count === 'number') {
      // make sure intl.formatMessage switches properly on the count
      values.count = count;
    }

    // react-intl will do the correct plurals if necessary
    const descriptor = {
      id,
      defaultMessage: source,
      description
    };
    const translation = intl.formatMessage(descriptor, values);

    // always wrap the translated string in a tag to contain everything
    // and to give us a spot to record the id. The resource id is the
    // the id in mojito for the string. Having this attr has these advantages:
    // 1. When debugging i18n or translation problems, it is MUCH easier to find
    // the exact string to fix in Mojito rather than guessing. It might be useful
    // for general debugging as well to map from something you see in the UI to
    // the actual code that implements it.
    // 2. It can be used by an in-context linguistic review tool. The tool code
    // can contact mojito and retrieve the English for any translation errors that
    // the reviewer finds and submit translation tickets to Jira and/or fixed
    // translations directly back to Mojito.
    // 3. It can be used by the planned "text experiment framework" to identify
    // whole strings in the UI that can be A/B tested in various languages without
    // publishing new versions of the code.
    return /*#__PURE__*/React.createElement(tagName, _objectSpread({
      key: id,
      'x-resource-id': id
    }, rest), composition.decompose(translation));
  }
}
_defineProperty(FormattedCompMessage, "defaultProps", {
  tagName: 'span'
});
export default injectIntl(FormattedCompMessage);
//# sourceMappingURL=FormattedCompMessage.js.map