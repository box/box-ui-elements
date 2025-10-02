function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Metadata sidebar component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import API from '../../api';
import EmptyContent from '../../features/metadata-instance-editor/EmptyContent';
import InlineError from '../../components/inline-error/InlineError';
import Instances from '../../features/metadata-instance-editor/Instances';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import TemplateDropdown from '../../features/metadata-instance-editor/TemplateDropdown';
import { normalizeTemplates } from '../../features/metadata-instance-editor/metadataUtil';
import { EVENT_JS_READY } from '../common/logger/constants';
import { isUserCorrectableError } from '../../utils/error';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS, FIELD_PERMISSIONS_CAN_UPLOAD, IS_ERROR_DISPLAYED, ORIGIN_METADATA_SIDEBAR, SIDEBAR_VIEW_METADATA } from '../../constants';
import './MetadataSidebar.scss';
const MARK_NAME_JS_READY = `${ORIGIN_METADATA_SIDEBAR}_${EVENT_JS_READY}`;
mark(MARK_NAME_JS_READY);
class MetadataSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      isLoading: false
    });
    /**
     * Common error callback
     *
     * @param {Error} error - API error
     * @param {string} code - error code
     * @param {Object} [newState] - optional state to set
     * @return {void}
     */
    _defineProperty(this, "onApiError", (error, code, newState = {}) => {
      const {
        onError
      } = this.props;
      const {
        status
      } = error;
      const isValidError = isUserCorrectableError(status);
      this.setState(_objectSpread({
        error: messages.sidebarMetadataEditingErrorContent,
        isLoading: false
      }, newState));
      onError(error, code, {
        error,
        [IS_ERROR_DISPLAYED]: isValidError
      });
    });
    /**
     * Instance remove handler
     *
     * @param {string} id - instance id
     * @return {void}
     */
    _defineProperty(this, "onRemove", id => {
      const {
        api
      } = this.props;
      const {
        file
      } = this.state;
      const editor = this.getEditor(id);
      if (!editor || !file) {
        return;
      }
      api.getMetadataAPI(false).deleteMetadata(file, editor.template, () => this.onRemoveSuccessHandler(editor), this.onApiError);
    });
    /**
     * Instance add success handler
     *
     * @param {Object} editor - instance editor
     * @return {void}
     */
    _defineProperty(this, "onAddSuccessHandler", editor => {
      const {
        editors = []
      } = this.state;
      const clone = editors.slice(0);
      clone.push(editor);
      this.setState({
        editors: clone,
        isLoading: false
      });
    });
    /**
     * Instance add handler
     *
     * @param {Object} template - instance template
     * @return {void}
     */
    _defineProperty(this, "onAdd", template => {
      const {
        api
      } = this.props;
      const {
        file
      } = this.state;
      if (!file) {
        return;
      }
      this.setState({
        isLoading: true
      });
      api.getMetadataAPI(false).createMetadata(file, template, this.onAddSuccessHandler, this.onApiError);
    });
    /**
     * Instance save handler
     *
     * @param {string} id - instance id
     * @param {Array} ops - json patch ops
     * @return {void}
     */
    _defineProperty(this, "onSave", (id, ops) => {
      const {
        api
      } = this.props;
      const {
        file
      } = this.state;
      const oldEditor = this.getEditor(id);
      if (!oldEditor || !file) {
        return;
      }
      api.getMetadataAPI(false).updateMetadata(file, oldEditor.template, ops, newEditor => {
        this.replaceEditor(oldEditor, newEditor);
      }, (error, code) => {
        this.onSaveErrorHandler(oldEditor, error, code);
      });
    });
    /**
     * Instance dirty handler
     *
     * @param {string} id - instance id
     * @param {boolean} isDirty - instance dirty state
     * @return {void}
     */
    _defineProperty(this, "onModification", (id, isDirty) => {
      const oldEditor = this.getEditor(id);
      if (!oldEditor) {
        return;
      }
      const newEditor = _objectSpread(_objectSpread({}, oldEditor), {}, {
        isDirty
      }); // shallow clone suffices for isDirty setting
      this.replaceEditor(oldEditor, newEditor);
    });
    /**
     * Handles a failed metadata fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    _defineProperty(this, "fetchMetadataErrorCallback", (e, code) => {
      this.onApiError(e, code, {
        editors: undefined,
        error: messages.sidebarMetadataFetchingErrorContent,
        templates: undefined
      });
    });
    /**
     * Handles a successful metadata fetch
     *
     * @param {Object} metadata - instances and templates
     * @return {void}
     */
    _defineProperty(this, "fetchMetadataSuccessCallback", ({
      editors,
      templates
    }) => {
      const {
        selectedTemplateKey,
        templateFilters
      } = this.props;
      this.setState({
        editors: editors.slice(0),
        // cloned for potential editing
        error: undefined,
        isLoading: false,
        templates: normalizeTemplates(templates, selectedTemplateKey, templateFilters)
      });
    });
    /**
     * Handles a failed file fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    _defineProperty(this, "fetchFileErrorCallback", (e, code) => {
      this.onApiError(e, code, {
        error: messages.sidebarFileFetchingErrorContent,
        file: undefined
      });
    });
    /**
     * Handles a successful file fetch.
     * Can be called multiple times when refreshing caches.
     * On file load we should fetch metadata, but we shouldn't need to fetch
     * if the file permissions haven't changed from a prior file fetch.
     * Metadata editors mostly care about upload permission.
     *
     * @param {Object} file - the Box file
     * @return {void}
     */
    _defineProperty(this, "fetchFileSuccessCallback", file => {
      const {
        file: currentFile
      } = this.state;
      const currentCanUpload = getProp(currentFile, FIELD_PERMISSIONS_CAN_UPLOAD, false);
      const newCanUpload = getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
      const shouldFetchMetadata = !currentFile || currentCanUpload !== newCanUpload;
      const callback = shouldFetchMetadata ? this.fetchMetadata : noop;
      this.setState({
        file
      }, callback);
    });
    const {
      logger
    } = this.props;
    logger.onReadyMetric({
      endMarkName: MARK_NAME_JS_READY
    });
  }
  componentDidMount() {
    this.fetchFile();
  }
  /**
   * Checks upload permission
   *
   * @return {boolean} - true if metadata can be edited
   */
  canEdit() {
    const {
      file
    } = this.state;
    return getProp(file, FIELD_PERMISSIONS_CAN_UPLOAD, false);
  }

  /**
   * Finds the editor we are editing
   *
   * @param {number} id - instance id
   * @return {Object} editor instance
   */
  getEditor(id) {
    const {
      editors = []
    } = this.state;
    return editors.find(({
      instance
    }) => instance.id === id);
  }

  /**
   * Instance remove success handler
   *
   * @param {Object} editor - the editor to remove
   * @return {void}
   */
  onRemoveSuccessHandler(editor) {
    const {
      editors = []
    } = this.state;
    const clone = editors.slice(0);
    clone.splice(editors.indexOf(editor), 1);
    this.setState({
      editors: clone
    });
  }
  /**
   * Instance save success handler
   *
   * @param {Object} oldEditor - prior editor
   * @param {Object} newEditor - updated editor
   * @return {void}
   */
  replaceEditor(oldEditor, newEditor) {
    const {
      editors = []
    } = this.state;
    const clone = editors.slice(0);
    clone.splice(editors.indexOf(oldEditor), 1, newEditor);
    this.setState({
      editors: clone
    });
  }

  /**
   * Instance save error handler
   *
   * @param {Object} oldEditor - prior editor
   * @param {Object} error - api error
   * @param {string} code - error code
   * @return {void}
   */
  onSaveErrorHandler(oldEditor, error, code) {
    const clone = _objectSpread(_objectSpread({}, oldEditor), {}, {
      hasError: true
    }); // shallow clone suffices for hasError setting
    this.replaceEditor(oldEditor, clone);
    this.onApiError(error, code);
  }
  /**
   * Fetches the metadata editors
   *
   * @return {void}
   */
  fetchMetadata() {
    const {
      api,
      isFeatureEnabled
    } = this.props;
    const {
      file
    } = this.state;
    if (!file) {
      return;
    }
    api.getMetadataAPI(false).getMetadata(file, this.fetchMetadataSuccessCallback, this.fetchMetadataErrorCallback, isFeatureEnabled, {
      refreshCache: true
    });
  }
  /**
   * Fetches a file with the fields needed for metadata sidebar
   *
   * @return {void}
   */
  fetchFile() {
    const {
      api,
      fileId
    } = this.props;
    api.getFileAPI().getFile(fileId, this.fetchFileSuccessCallback, this.fetchFileErrorCallback, {
      fields: [FIELD_IS_EXTERNALLY_OWNED, FIELD_PERMISSIONS],
      refreshCache: true // see implications in file success callback
    });
  }
  refresh() {
    this.fetchMetadata();
  }
  render() {
    const {
      editors,
      file,
      error,
      isLoading,
      templates
    } = this.state;
    const {
      elementId,
      selectedTemplateKey
    } = this.props;
    const showEditor = !!file && !!templates && !!editors;
    const showLoadingIndicator = !error && !showEditor;
    const canEdit = this.canEdit();
    const showTemplateDropdown = showEditor && canEdit;
    const showEmptyContent = showEditor && editors.length === 0;
    return /*#__PURE__*/React.createElement(SidebarContent, {
      actions: showTemplateDropdown ? /*#__PURE__*/React.createElement(TemplateDropdown, {
        hasTemplates: templates && templates.length !== 0,
        isDropdownBusy: false,
        onAdd: this.onAdd
        // $FlowFixMe checked via showTemplateDropdown & showEditor
        ,
        templates: templates
        // $FlowFixMe checked via showTemplateDropdown & showEditor
        ,
        usedTemplates: editors.map(editor => editor.template)
      }) : null,
      className: "bcs-metadata",
      elementId: elementId,
      sidebarView: SIDEBAR_VIEW_METADATA,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarMetadataTitle)
    }, error && /*#__PURE__*/React.createElement(InlineError, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.error)
    }, /*#__PURE__*/React.createElement(FormattedMessage, error)), showLoadingIndicator && /*#__PURE__*/React.createElement(LoadingIndicator, null), showEditor && /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
      className: "metadata-instance-editor",
      isLoading: isLoading
    }, showEmptyContent ? /*#__PURE__*/React.createElement(EmptyContent, {
      canAdd: canEdit
    }) : /*#__PURE__*/React.createElement(Instances, {
      editors: editors,
      onModification: this.onModification,
      onRemove: this.onRemove,
      onSave: this.onSave,
      selectedTemplateKey: selectedTemplateKey
    })));
  }
}
_defineProperty(MetadataSidebar, "defaultProps", {
  isFeatureEnabled: true
});
export { MetadataSidebar as MetadataSidebarComponent };
export default flow([withLogger(ORIGIN_METADATA_SIDEBAR), withErrorBoundary(ORIGIN_METADATA_SIDEBAR), withAPIContext])(MetadataSidebar);
//# sourceMappingURL=MetadataSidebar.js.map