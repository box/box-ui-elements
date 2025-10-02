function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the Box AI API endpoint
 * @author Box
 */

import Base from './Base';
import { AiExtractResponse } from './schemas/AiExtractResponse';
import { AiExtractStructured } from './schemas/AiExtractStructured';
import { ERROR_CODE_EXTRACT_STRUCTURED } from '../constants';
class Intelligence extends Base {
  /**
   * API endpoint to ask ai a question
   *
   * @param {QuestionType} question - Object should at least contain the prompt, which is the question to ask
   * @param {Array<object>} items - Array of items to ask about
   * @param {Array<QuestionType>} dialogueHistory - Array of previous questions object that already have answers
   * @param {{ include_citations?: boolean }} options - Optional parameters
   * @return {Promise}
   */
  async ask(question, items, dialogueHistory = [], options = {}) {
    const {
      prompt
    } = question;
    if (!prompt) {
      throw new Error('Missing prompt!');
    }
    if (!items || items.length === 0) {
      throw new Error('Missing items!');
    }
    items.forEach(item => {
      if (!item.id || !item.type) {
        throw new Error('Invalid item!');
      }
    });
    const url = `${this.getBaseApiUrl()}/ai/ask`;
    return this.xhr.post({
      url,
      id: `file_${items[0].id}`,
      data: _objectSpread({
        mode: 'single_item_qa',
        prompt,
        items,
        dialogue_history: dialogueHistory
      }, options)
    });
  }

  /**
   * Sends an AI request to supported LLMs and returns extracted key pairs and values.
   *
   * @param {AiExtractStructured} request - AI Extract Structured Request
   * @return A successful response including the answer from the LLM.
   */
  async extractStructured(request) {
    this.errorCode = ERROR_CODE_EXTRACT_STRUCTURED;
    const {
      items
    } = request;
    if (!items || items.length === 0) {
      throw new Error('Missing items!');
    }
    const item = items[0];
    if (!item.id || !item.type) {
      throw new Error('Invalid item!');
    }
    const url = `${this.getBaseApiUrl()}/ai/extract_structured`;
    const suggestionsResponse = await this.xhr.post({
      url,
      data: request,
      id: `file_${item.id}`
    });
    return !!suggestionsResponse?.data?.answer && typeof suggestionsResponse.data.answer === 'object' ? suggestionsResponse.data.answer : suggestionsResponse.data;
  }
}
export default Intelligence;
//# sourceMappingURL=Intelligence.js.map