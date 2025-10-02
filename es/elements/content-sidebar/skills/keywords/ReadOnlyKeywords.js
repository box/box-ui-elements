function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Read Only Keywords Card component
 * @author Box
 */

import * as React from 'react';
import PillCloud from '../../../../components/pill-cloud/PillCloud';
import { SKILLS_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';
import Timeline from '../timeline';
import getPills from './keywordUtils';
import './ReadOnlyKeywords.scss';
class ReadOnlyselecteds extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      selectedIndex: -1
    });
    /**
     * Shows the time line by selecting the keyword
     *
     * @private
     * @param {Object} pill - keyword
     * @return {void}
     */
    _defineProperty(this, "onSelect", pill => {
      const {
        selectedIndex
      } = this.state;
      const newIndex = pill.value;
      this.setState({
        selectedIndex: selectedIndex === newIndex ? -1 : newIndex
      });
    });
  }
  /**
   * Renders the keywords
   *
   * @private
   * @return {void}
   */
  render() {
    const {
      keywords,
      getViewer,
      duration
    } = this.props;
    const {
      selectedIndex
    } = this.state;
    const options = getPills(keywords);
    const selected = keywords[selectedIndex];
    const pillCloudProps = selected ? {
      selectedOptions: [options[selectedIndex]]
    } : {};
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PillCloud, _extends({
      onSelect: this.onSelect,
      options: options
    }, pillCloudProps, {
      buttonProps: {
        [INTERACTION_TARGET]: SKILLS_TARGETS.KEYWORDS.SELECT
      }
    })), !!selected && Array.isArray(selected.appears) && selected.appears.length > 0 && /*#__PURE__*/React.createElement(Timeline, {
      duration: duration,
      getViewer: getViewer,
      interactionTarget: SKILLS_TARGETS.KEYWORDS.TIMELINE,
      text: selected.text,
      timeslices: selected.appears
    }));
  }
}
export default ReadOnlyselecteds;
//# sourceMappingURL=ReadOnlyKeywords.js.map