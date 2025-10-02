/**
 * 
 * @file Utilities for keywords skill
 * @author Box
 */

/**
 * Converts skill card entries into pills
 *
 * @private
 * @param {Array<Object>} props - keyword entries
 * @return {Array<Object>} pills
 */
const getPills = (keywords = []) => keywords.map((keyword, index) => ({
  displayText: keyword.text,
  value: index
}));
export default getPills;
//# sourceMappingURL=keywordUtils.js.map