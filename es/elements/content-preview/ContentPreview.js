const _excluded = ["error"],
  _excluded2 = ["advancedContentInsights", "annotatorState", "enableThumbnailsSidebar", "features", "fileOptions", "onAnnotatorEvent", "onAnnotator", "onContentInsightsEventReport", "previewExperiences", "showAnnotationsControls", "token"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import setProp from 'lodash/set';
import throttle from 'lodash/throttle';
import uniqueid from 'lodash/uniqueId';
import Measure from 'react-measure';
import { withRouter } from 'react-router-dom';
import { decode } from '../../utils/keys';
import makeResponsive from '../common/makeResponsive';
import { withNavRouter } from '../common/nav-router';
import Internationalize from '../common/Internationalize';
import AsyncLoad from '../common/async-load';
// $FlowFixMe TypeScript file
import ThemingStyles from '../common/theming';
// $FlowFixMe TypeScript file
import PreviewContext from './PreviewContext';
import TokenService from '../../utils/TokenService';
import { isInputElement, focus } from '../../utils/dom';
import { getTypedFileId } from '../../utils/file';
import { withAnnotations, withAnnotatorContext } from '../common/annotator-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { PREVIEW_FIELDS_TO_FETCH } from '../../utils/fields';
import { mark } from '../../utils/performance';
import { withFeatureConsumer, withFeatureProvider } from '../common/feature-checking';
// $FlowFixMe
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { EVENT_JS_READY } from '../common/logger/constants';
import ReloadNotification from './ReloadNotification';
import API from '../../api';
import APIContext from '../common/api-context';
import PreviewHeader from './preview-header';
import PreviewMask from './PreviewMask';
import PreviewNavigation from './PreviewNavigation';
import Providers from '../common/Providers';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_APP, DEFAULT_HOSTNAME_STATIC, DEFAULT_PREVIEW_VERSION, DEFAULT_LOCALE, DEFAULT_PATH_STATIC_PREVIEW, CLIENT_NAME_CONTENT_PREVIEW, CLIENT_VERSION, ORIGIN_PREVIEW, ORIGIN_CONTENT_PREVIEW, ERROR_CODE_UNKNOWN } from '../../constants';

// $FlowFixMe TypeScript file

import '../common/fonts.scss';
import '../common/base.scss';
import './ContentPreview.scss';

// Emitted by preview's 'load' event

// Emitted by preview's 'preview_metric' event

const startAtTypes = {
  page: 'pages'
};
const InvalidIdError = new Error('Invalid id for Preview!');
const PREVIEW_LOAD_METRIC_EVENT = 'load';
const MARK_NAME_JS_READY = `${ORIGIN_CONTENT_PREVIEW}_${EVENT_JS_READY}`;
mark(MARK_NAME_JS_READY);
const LoadableSidebar = AsyncLoad({
  loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-sidebar" */'../content-sidebar')
});
class ContentPreview extends React.PureComponent {
  /**
   * @property {number}
   */

  /**
   * @property {number}
   */

  /**
   * [constructor]
   *
   * @return {ContentPreview}
   */
  constructor(props) {
    super(props);
    // Defines a generic type for ContentSidebar, since an import would interfere with code splitting
    _defineProperty(this, "contentSidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "previewBodyRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "previewContextValue", {
      previewBodyRef: this.previewBodyRef
    });
    _defineProperty(this, "initialState", {
      canPrint: false,
      error: undefined,
      isLoading: true,
      isReloadNotificationVisible: false,
      isThumbnailSidebarOpen: false
    });
    /**
     * Handler for 'preview_error' preview event
     *
     * @param {PreviewLibraryError} previewError - the error data emitted from preview
     * @return {void}
     */
    _defineProperty(this, "onPreviewError", _ref => {
      let {
          error
        } = _ref,
        rest = _objectWithoutProperties(_ref, _excluded);
      const {
        code = ERROR_CODE_UNKNOWN
      } = error;
      const {
        onError
      } = this.props;

      // In case of error, there should be no thumbnail sidebar to account for
      this.setState({
        isLoading: false,
        isThumbnailSidebarOpen: false
      });
      onError(error, code, _objectSpread(_objectSpread({}, rest), {}, {
        error
      }), ORIGIN_PREVIEW);
    });
    /**
     * Event handler 'preview_metric' which also adds in the file fetch time if it's a load event
     *
     * @param {Object} previewMetrics - the object emitted by 'preview_metric'
     * @return {void}
     */
    _defineProperty(this, "onPreviewMetric", previewMetrics => {
      const {
        logger
      } = this.props;
      const {
        event_name
      } = previewMetrics;
      let metrics = _objectSpread({}, previewMetrics);

      // We need to add in the total file fetch time to the file_info_time and value (total)
      // as preview does not do the files call
      if (event_name === PREVIEW_LOAD_METRIC_EVENT) {
        const totalFetchFileTime = this.getTotalFileFetchTime();
        const totalTime = (previewMetrics.value || 0) + totalFetchFileTime;

        // If an unnatural load time occurs or is invalid, don't log a load event
        if (!totalTime) {
          return;
        }
        metrics = _objectSpread(_objectSpread({}, previewMetrics), {}, {
          file_info_time: totalFetchFileTime,
          value: totalTime
        });
      }
      logger.onPreviewMetric(metrics);
    });
    /**
     * onLoad function for preview
     *
     * @return {void}
     */
    _defineProperty(this, "onPreviewLoad", data => {
      const {
        onLoad,
        collection
      } = this.props;
      const currentIndex = this.getFileIndex();
      const filesToPrefetch = collection.slice(currentIndex + 1, currentIndex + 5);
      const previewTimeMetrics = getProp(data, 'metrics.time');
      let loadData = data;
      if (previewTimeMetrics) {
        const totalPreviewMetrics = this.addFetchFileTimeToPreviewMetrics(previewTimeMetrics);
        loadData = _objectSpread(_objectSpread({}, loadData), {}, {
          metrics: _objectSpread(_objectSpread({}, loadData.metrics), {}, {
            time: totalPreviewMetrics
          })
        });
      }
      onLoad(loadData);
      this.setState({
        isLoading: false
      });
      this.focusPreview();
      if (this.preview && filesToPrefetch.length) {
        this.prefetch(filesToPrefetch);
      }
      this.handleCanPrint();
    });
    /**
     * Loads preview in the component using the preview library.
     *
     * @return {void}
     */
    _defineProperty(this, "loadPreview", async () => {
      const _this$props = this.props,
        {
          advancedContentInsights,
          // will be removed once preview package will be updated to utilize feature flip for ACI
          annotatorState: {
            activeAnnotationId
          } = {},
          enableThumbnailsSidebar,
          features,
          fileOptions,
          onAnnotatorEvent,
          onAnnotator,
          onContentInsightsEventReport,
          previewExperiences,
          showAnnotationsControls,
          token: tokenOrTokenFunction
        } = _this$props,
        rest = _objectWithoutProperties(_this$props, _excluded2);
      const {
        file,
        selectedVersion,
        startAt
      } = this.state;
      if (!this.isPreviewLibraryLoaded() || !file || !tokenOrTokenFunction) {
        return;
      }
      const fileId = this.getFileId(file);
      if (fileId !== this.state.currentFileId) {
        return;
      }
      const fileOpts = _objectSpread({}, fileOptions);
      const token = typedId => TokenService.getReadTokens(typedId, tokenOrTokenFunction);
      if (selectedVersion) {
        setProp(fileOpts, [fileId, 'fileVersionId'], selectedVersion.id);
        setProp(fileOpts, [fileId, 'currentFileVersionId'], getProp(file, 'file_version.id'));
      }
      if (activeAnnotationId) {
        setProp(fileOpts, [fileId, 'annotations', 'activeId'], activeAnnotationId);
      }
      if (startAt) {
        setProp(fileOpts, [fileId, 'startAt'], startAt);
      }
      const previewOptions = {
        advancedContentInsights,
        // will be removed once preview package will be updated to utilize feature flip for ACI
        container: `#${this.id} .bcpr-content`,
        enableThumbnailsSidebar,
        features,
        fileOptions: fileOpts,
        header: 'none',
        headerElement: `#${this.id} .bcpr-PreviewHeader`,
        experiences: previewExperiences,
        showAnnotations: this.canViewAnnotations(),
        showAnnotationsControls,
        showDownload: this.canDownload(),
        showLoading: false,
        showProgress: false,
        skipServerUpdate: true,
        useHotkeys: false
      };
      const {
        Preview
      } = global.Box;
      this.preview = new Preview();
      this.preview.addListener('load', this.onPreviewLoad);
      this.preview.addListener('preview_error', this.onPreviewError);
      this.preview.addListener('preview_metric', this.onPreviewMetric);
      this.preview.addListener('thumbnailsOpen', () => this.setState({
        isThumbnailSidebarOpen: true
      }));
      this.preview.addListener('thumbnailsClose', () => this.setState({
        isThumbnailSidebarOpen: false
      }));
      if (showAnnotationsControls) {
        this.preview.addListener('annotator_create', onAnnotator);
      }
      this.preview.updateFileCache([file]);
      this.preview.show(file.id, token, _objectSpread(_objectSpread({}, previewOptions), omit(rest, Object.keys(previewOptions))));
      if (advancedContentInsights) {
        this.preview.addListener('advanced_insights_report', onContentInsightsEventReport);
      }
    });
    /**
     * Updates preview file from temporary staged file.
     *
     * @return {void}
     */
    _defineProperty(this, "loadFileFromStage", () => {
      if (this.stagedFile) {
        this.setState(_objectSpread(_objectSpread({}, this.initialState), {}, {
          file: this.stagedFile
        }), () => {
          this.stagedFile = undefined;
        });
      }
    });
    /**
     * Removes the reload notification
     *
     * @return {void}
     */
    _defineProperty(this, "closeReloadNotification", () => {
      this.setState({
        isReloadNotificationVisible: false
      });
    });
    /**
     * Tells the preview to resize
     *
     * @return {void}
     */
    _defineProperty(this, "onResize", () => {
      if (this.preview && this.preview.getCurrentViewer()) {
        this.preview.resize();
      }
    });
    /**
     * File fetch success callback
     *
     * @param {Object} file - Box file
     * @return {void}
     */
    _defineProperty(this, "fetchFileSuccessCallback", file => {
      this.fetchFileEndTime = performance.now();
      const {
        file: currentFile
      } = this.state;
      const isExistingFile = currentFile ? currentFile.id === file.id : false;
      const isWatermarked = getProp(file, 'watermark_info.is_watermarked', false);

      // If the file is watermarked or if its a new file, then update the state
      // In this case preview should reload without prompting the user
      if (isWatermarked || !isExistingFile) {
        this.setState(_objectSpread(_objectSpread({}, this.initialState), {}, {
          file
        }));
        // $FlowFixMe file version and sha1 should exist at this point
      } else if (currentFile.file_version.sha1 !== file.file_version.sha1) {
        // If we are already prevewing the file that got updated then show the
        // user a notification to reload the file only if its sha1 changed
        this.stagedFile = file;
        this.setState(_objectSpread(_objectSpread({}, this.initialState), {}, {
          isReloadNotificationVisible: true
        }));
      }
    });
    /**
     * File fetch error callback
     *
     * @return {void}
     */
    _defineProperty(this, "fetchFileErrorCallback", (fileError, code) => {
      const {
        onError
      } = this.props;
      const errorCode = fileError.code || code;
      const error = {
        code: errorCode,
        message: fileError.message
      };
      this.setState({
        error,
        file: undefined,
        isLoading: false
      });
      onError(fileError, errorCode, {
        error: fileError
      });
    });
    /**
     * Returns the preview instance
     *
     * @return {Preview} current instance of preview
     */
    _defineProperty(this, "getPreview", () => {
      const {
        file
      } = this.state;
      if (!this.preview || !file) {
        return null;
      }
      return this.preview;
    });
    /**
     * Returns the viewer instance being used by preview.
     * This will let child components access the viewers.
     *
     * @return {Viewer} current instance of the preview viewer
     */
    _defineProperty(this, "getViewer", () => {
      const preview = this.getPreview();
      const viewer = preview ? preview.getCurrentViewer() : null;
      return viewer && viewer.isLoaded() && !viewer.isDestroyed() ? viewer : null;
    });
    /**
     * Shows a preview of the previous file.
     *
     * @public
     * @return {void}
     */
    _defineProperty(this, "navigateLeft", () => {
      const currentIndex = this.getFileIndex();
      const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
      if (newIndex !== currentIndex) {
        this.navigateToIndex(newIndex);
      }
    });
    /**
     * Shows a preview of the next file.
     *
     * @public
     * @return {void}
     */
    _defineProperty(this, "navigateRight", () => {
      const {
        collection
      } = this.props;
      const currentIndex = this.getFileIndex();
      const newIndex = currentIndex === collection.length - 1 ? collection.length - 1 : currentIndex + 1;
      if (newIndex !== currentIndex) {
        this.navigateToIndex(newIndex);
      }
    });
    /**
     * Downloads file.
     *
     * @public
     * @return {void}
     */
    _defineProperty(this, "download", () => {
      const {
        onDownload
      } = this.props;
      const {
        file
      } = this.state;
      if (this.preview) {
        this.preview.download();
        onDownload(cloneDeep(file));
      }
    });
    /**
     * Prints file.
     *
     * @public
     * @return {void}
     */
    _defineProperty(this, "print", () => {
      if (this.preview) {
        this.preview.print();
      }
    });
    /**
     * Mouse move handler that is throttled and show
     * the navigation arrows if applicable.
     *
     * @return {void}
     */
    _defineProperty(this, "onMouseMove", throttle(() => {
      const viewer = this.getViewer();
      const isPreviewing = !!viewer;
      const CLASS_NAVIGATION_VISIBILITY = 'bcpr-nav-is-visible';
      clearTimeout(this.mouseMoveTimeoutID);
      if (!this.previewContainer) {
        return;
      }

      // Always assume that navigation arrows will be hidden
      this.previewContainer.classList.remove(CLASS_NAVIGATION_VISIBILITY);

      // Only show it if either we aren't previewing or if we are then the viewer
      // is not blocking the show. If we are previewing then the viewer may choose
      // to not allow navigation arrows. This is mostly useful for videos since the
      // navigation arrows may interfere with the settings menu inside video player.
      if (this.previewContainer && (!isPreviewing || viewer.allowNavigationArrows())) {
        this.previewContainer.classList.add(CLASS_NAVIGATION_VISIBILITY);
      }
      this.mouseMoveTimeoutID = setTimeout(() => {
        if (this.previewContainer) {
          this.previewContainer.classList.remove(CLASS_NAVIGATION_VISIBILITY);
        }
      }, 1500);
    }, 1000));
    /**
     * Keyboard events
     *
     * @return {void}
     */
    _defineProperty(this, "onKeyDown", event => {
      const {
        useHotkeys
      } = this.props;
      if (!useHotkeys) {
        return;
      }
      let consumed = false;
      const key = decode(event);
      const viewer = this.getViewer();

      // If focus was on an input or if the viewer doesn't exist
      // then don't bother doing anything further
      if (!key || !viewer || isInputElement(event.target)) {
        return;
      }
      if (typeof viewer.onKeydown === 'function') {
        consumed = !!viewer.onKeydown(key, event.nativeEvent);
      }
      if (!consumed) {
        switch (key) {
          case 'ArrowLeft':
            this.navigateLeft();
            consumed = true;
            break;
          case 'ArrowRight':
            this.navigateRight();
            consumed = true;
            break;
          default:
          // no-op
        }
      }
      if (consumed) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
    /**
     * Handles version change events
     *
     * @param {string} [version] - The version that is now previewed
     * @param {object} [additionalVersionInfo] - extra info about the version
     */
    _defineProperty(this, "onVersionChange", (version, additionalVersionInfo = {}) => {
      const {
        onVersionChange
      } = this.props;
      this.updateVersionToCurrent = additionalVersionInfo.updateVersionToCurrent;
      onVersionChange(version, additionalVersionInfo);
      this.setState({
        selectedVersion: version
      });
    });
    _defineProperty(this, "handleAnnotationSelect", ({
      file_version,
      id,
      target
    }) => {
      const {
        location = {}
      } = target;
      const {
        file,
        selectedVersion
      } = this.state;
      const annotationFileVersionId = getProp(file_version, 'id');
      const currentFileVersionId = getProp(file, 'file_version.id');
      const currentPreviewFileVersionId = getProp(selectedVersion, 'id', currentFileVersionId);
      const unit = startAtTypes[location.type];
      const viewer = this.getViewer();
      if (unit && annotationFileVersionId && annotationFileVersionId !== currentPreviewFileVersionId) {
        this.setState({
          startAt: {
            unit,
            value: location.value
          }
        });
      }
      if (viewer) {
        viewer.emit('scrolltoannotation', {
          id,
          target
        });
      }
    });
    /**
     * Holds the reference the preview container
     *
     * @return {void}
     */
    _defineProperty(this, "containerRef", container => {
      this.previewContainer = container;
    });
    /**
     * Fetches a thumbnail for the page given
     *
     * @return {Promise|null} - promise resolves with the image HTMLElement or null if generation is in progress
     */
    _defineProperty(this, "getThumbnail", pageNumber => {
      const preview = this.getPreview();
      if (preview && preview.viewer) {
        return preview.viewer.getThumbnail(pageNumber);
      }
      return null;
    });
    const {
      apiHost,
      cache,
      fileId: _fileId,
      language,
      requestInterceptor,
      responseInterceptor,
      sharedLink,
      sharedLinkPassword,
      token: _token
    } = props;
    this.id = uniqueid('bcpr_');
    this.api = new API({
      apiHost,
      cache,
      clientName: CLIENT_NAME_CONTENT_PREVIEW,
      language,
      requestInterceptor,
      responseInterceptor,
      sharedLink,
      sharedLinkPassword,
      token: _token,
      version: CLIENT_VERSION
    });
    this.state = _objectSpread(_objectSpread({}, this.initialState), {}, {
      currentFileId: _fileId,
      // eslint-disable-next-line react/no-unused-state
      prevFileIdProp: _fileId
    });
    const {
      logger: _logger
    } = props;
    _logger.onReadyMetric({
      endMarkName: MARK_NAME_JS_READY
    });
  }

  /**
   * Cleanup
   *
   * @return {void}
   */
  componentWillUnmount() {
    // Don't destroy the cache while unmounting
    this.api.destroy(false);
    this.destroyPreview();
  }

  /**
   * Cleans up the preview instance
   */
  destroyPreview(shouldReset = true) {
    const {
      onPreviewDestroy
    } = this.props;
    if (this.preview) {
      this.preview.destroy();
      this.preview.removeAllListeners();
      this.preview = undefined;
      onPreviewDestroy(shouldReset);
    }
  }

  /**
   * Destroys api instances with caches
   *
   * @private
   * @return {void}
   */
  clearCache() {
    this.api.destroy(true);
  }

  /**
   * Once the component mounts, load Preview assets and fetch file info.
   *
   * @return {void}
   */
  componentDidMount() {
    this.loadStylesheet();
    this.loadScript();
    this.fetchFile(this.state.currentFileId);
    this.focusPreview();
  }
  static getDerivedStateFromProps(props, state) {
    const {
      fileId
    } = props;
    if (fileId !== state.prevFileIdProp) {
      return {
        currentFileId: fileId,
        prevFileIdProp: fileId
      };
    }
    return null;
  }

  /**
   * After component updates, load Preview if appropriate.
   *
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState) {
    const {
      features,
      previewExperiences,
      token
    } = this.props;
    const {
      features: prevFeatures,
      previewExperiences: prevPreviewExperiences,
      token: prevToken
    } = prevProps;
    const {
      currentFileId
    } = this.state;
    const hasFileIdChanged = prevState.currentFileId !== currentFileId;
    const hasTokenChanged = prevToken !== token;
    const haveAdvancedContentInsightsChanged = !isEqual(prevFeatures?.advancedContentInsights, features?.advancedContentInsights);
    const haveExperiencesChanged = prevPreviewExperiences !== previewExperiences;
    if (hasFileIdChanged) {
      this.destroyPreview();
      this.setState({
        isLoading: true,
        selectedVersion: undefined
      });
      this.fetchFile(currentFileId);
    } else if (this.shouldLoadPreview(prevState)) {
      this.destroyPreview(false);
      this.setState({
        isLoading: true
      });
      this.loadPreview();
    } else if (hasTokenChanged) {
      this.updatePreviewToken();
    }
    if (haveExperiencesChanged && this.preview && this.preview.updateExperiences) {
      this.preview.updateExperiences(previewExperiences);
    }
    if (this.preview?.updateContentInsightsOptions && features?.advancedContentInsights && haveAdvancedContentInsightsChanged) {
      this.preview.updateContentInsightsOptions(features?.advancedContentInsights);
    }
  }

  /**
   * Updates the access token used by preview library
   *
   * @param {boolean} shouldReload - true if preview should be reloaded
   */
  updatePreviewToken(shouldReload = false) {
    if (this.preview) {
      this.preview.updateToken(this.props.token, shouldReload);
    }
  }

  /**
   * Returns whether or not preview should be loaded.
   *
   * @param {State} prevState - Previous state
   * @return {boolean}
   */
  shouldLoadPreview(prevState) {
    const {
      file,
      selectedVersion
    } = this.state;
    const {
      file: prevFile,
      selectedVersion: prevSelectedVersion
    } = prevState;
    const prevSelectedVersionId = getProp(prevSelectedVersion, 'id');
    const selectedVersionId = getProp(selectedVersion, 'id');
    const prevFileVersionId = getProp(prevFile, 'file_version.id');
    const fileVersionId = getProp(file, 'file_version.id');
    let loadPreview = false;
    if (selectedVersionId !== prevSelectedVersionId) {
      const isPreviousCurrent = fileVersionId === prevSelectedVersionId || !prevSelectedVersionId;
      const isSelectedCurrent = fileVersionId === selectedVersionId || !selectedVersionId;

      // Load preview if the user has selected a non-current version of the file
      loadPreview = !isPreviousCurrent || !isSelectedCurrent;
    } else if (fileVersionId && prevFileVersionId) {
      // Load preview if the file's current version ID has changed
      loadPreview = fileVersionId !== prevFileVersionId;
    } else {
      // Load preview if file object has newly been populated in state
      loadPreview = !prevFile && !!file;
    }
    return loadPreview;
  }

  /**
   * Returns preview asset urls
   *
   * @return {string} base url
   */
  getBasePath(asset) {
    const {
      staticHost,
      staticPath,
      language,
      previewLibraryVersion
    } = this.props;
    const path = `${staticPath}/${previewLibraryVersion}/${language}/${asset}`;
    const suffix = staticHost.endsWith('/') ? path : `/${path}`;
    return `${staticHost}${suffix}`;
  }

  /**
   * Determines if preview assets are loaded
   *
   * @return {boolean} true if preview is loaded
   */
  isPreviewLibraryLoaded() {
    return !!global.Box && !!global.Box.Preview;
  }

  /**
   * Loads external css by appending a <link> element
   *
   * @return {void}
   */
  loadStylesheet() {
    const {
      head
    } = document;
    const url = this.getBasePath('preview.css');
    if (!head || head.querySelector(`link[rel="stylesheet"][href="${url}"]`)) {
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    head.appendChild(link);
  }

  /**
   * Loads external script by appending a <script> element
   *
   * @return {void}
   */
  loadScript() {
    const {
      head
    } = document;
    const url = this.getBasePath('preview.js');
    if (!head || this.isPreviewLibraryLoaded()) {
      return;
    }
    const previewScript = head.querySelector(`script[src="${url}"]`);
    if (previewScript) {
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.addEventListener('load', this.loadPreview);
    head.appendChild(script);
  }

  /**
   * Focuses the preview on load.
   *
   * @return {void}
   */
  focusPreview() {
    const {
      autoFocus,
      getInnerRef
    } = this.props;
    if (autoFocus && !isInputElement(document.activeElement)) {
      focus(getInnerRef());
    }
  }

  /**
   * Updates preview cache and prefetches a file
   *
   * @param {BoxItem} file - file to prefetch
   * @return {void}
   */
  updatePreviewCacheAndPrefetch(file, token) {
    if (!this.preview || !file || !file.id) {
      return;
    }
    this.preview.updateFileCache([file]);
    this.preview.prefetch({
      fileId: file.id,
      token
    });
  }

  /**
   * Gets the file id
   *
   * @param {string|BoxItem} file - box file or file id
   * @return {string} file id
   */
  getFileId(file) {
    if (typeof file === 'string') {
      return file;
    }
    if (typeof file === 'object' && !!file.id) {
      return file.id;
    }
    throw InvalidIdError;
  }

  /**
   * Prefetches the next few preview files if any
   *
   * @param {Array<string|BoxItem>} files - files to prefetch
   * @return {void}
   */
  async prefetch(files) {
    const {
      token
    } = this.props;
    const typedIds = files.map(file => getTypedFileId(this.getFileId(file)));
    await TokenService.cacheTokens(typedIds, token);
    files.forEach(file => {
      const fileId = this.getFileId(file);
      this.fetchFile(fileId, noop, noop, {
        refreshCache: false
      });
    });
  }

  /**
   * Calculates the total file fetch time
   *
   * @return {number} the total fetch time
   */
  getTotalFileFetchTime() {
    if (!this.fetchFileStartTime || !this.fetchFileEndTime) {
      return 0;
    }
    return Math.round(this.fetchFileEndTime - this.fetchFileStartTime);
  }
  /**
   * Adds in the file fetch time to the preview metrics
   *
   * @param {Object} previewTimeMetrics - the preview time metrics
   * @return {Object} the preview time metrics merged with the files call time
   */
  addFetchFileTimeToPreviewMetrics(previewTimeMetrics) {
    const totalFetchFileTime = this.getTotalFileFetchTime();
    const {
      rendering,
      conversion,
      preload
    } = previewTimeMetrics;

    // We need to add in the total file fetch time to the rendering and total as preview
    // does not do the files call. In the case the file is in the process of
    // being converted, we need to add to conversion instead of the render
    let totalConversion = conversion;
    let totalRendering = rendering;
    let totalPreload = preload;
    if (conversion) {
      totalConversion += totalFetchFileTime;
    } else {
      totalRendering += totalFetchFileTime;
    }
    if (totalPreload) {
      // Preload is optional, depending on file type
      totalPreload += totalFetchFileTime;
    }
    const previewMetrics = {
      conversion: totalConversion,
      rendering: totalRendering,
      total: totalRendering + totalConversion,
      preload: totalPreload
    };
    return previewMetrics;
  }
  /**
   * Returns whether file can be downloaded based on file properties, permissions, and user-defined options.
   *
   * @return {boolean}
   */
  canDownload() {
    const {
      canDownload
    } = this.props;
    const {
      file
    } = this.state;
    const isFileDownloadable = getProp(file, 'permissions.can_download', false) && getProp(file, 'is_download_available', false);
    return isFileDownloadable && !!canDownload;
  }

  /**
   * Returns whether file can be annotated based on permissions
   *
   * @return {boolean}
   */
  canAnnotate() {
    const {
      showAnnotations
    } = this.props;
    const {
      file
    } = this.state;
    const isFileAnnotatable = getProp(file, 'permissions.can_annotate', false);
    return !!showAnnotations && isFileAnnotatable;
  }

  /**
   * Returns whether a preview should render annotations based on permissions
   *
   * @return {boolean}
   */
  canViewAnnotations() {
    const {
      showAnnotations
    } = this.props;
    const {
      file
    } = this.state;
    const hasViewAllPermissions = getProp(file, 'permissions.can_view_annotations_all', false);
    const hasViewSelfPermissions = getProp(file, 'permissions.can_view_annotations_self', false);
    return !!showAnnotations && (this.canAnnotate() || hasViewAllPermissions || hasViewSelfPermissions);
  }
  handleCanPrint() {
    const preview = this.getPreview();
    this.setState({
      canPrint: !!preview && (!preview.canPrint || preview.canPrint())
    });
  }
  /**
   * Fetches a file
   *
   * @param {string} id file id
   * @param {Function|void} [successCallback] - Callback after file is fetched
   * @param {Function|void} [errorCallback] - Callback after error
   * @param {Object|void} [fetchOptions] - Fetch options
   * @return {void}
   */
  fetchFile(id, successCallback, errorCallback, fetchOptions = {}) {
    if (!id) {
      return;
    }
    this.fetchFileStartTime = performance.now();
    this.fetchFileEndTime = null;
    this.api.getFileAPI().getFile(id, successCallback || this.fetchFileSuccessCallback, errorCallback || this.fetchFileErrorCallback, _objectSpread(_objectSpread({}, fetchOptions), {}, {
      fields: PREVIEW_FIELDS_TO_FETCH
    }));
  }
  /**
   * Finds the index of current file inside the collection
   *
   * @return {number} -1 if not indexed
   */
  getFileIndex() {
    const {
      currentFileId
    } = this.state;
    const {
      collection
    } = this.props;
    if (!currentFileId || collection.length < 2) {
      return -1;
    }
    return collection.findIndex(item => {
      if (typeof item === 'string') {
        return item === currentFileId;
      }
      return item.id === currentFileId;
    });
  }

  /**
   * Shows a preview of a file at the specified index in the current collection.
   *
   * @public
   * @param {number} index - Index of file to preview
   * @return {void}
   */
  navigateToIndex(index) {
    const {
      collection,
      onNavigate
    } = this.props;
    const {
      length
    } = collection;
    if (length < 2 || index < 0 || index > length - 1) {
      return;
    }
    const fileOrId = collection[index];
    const fileId = typeof fileOrId === 'object' ? fileOrId.id || '' : fileOrId;
    this.setState({
      currentFileId: fileId
    }, () => {
      // Execute navigation callback
      onNavigate(fileId);
    });
  }
  /**
   * Refreshes the content sidebar panel
   *
   * @return {void}
   */
  refreshSidebar() {
    const {
      current: contentSidebar
    } = this.contentSidebar;
    if (contentSidebar) {
      contentSidebar.refresh();
    }
  }
  /**
   * Renders the file preview
   *
   * @inheritdoc
   * @return {Element}
   */
  render() {
    const {
      apiHost,
      collection,
      token,
      language,
      messages,
      className,
      contentAnswersProps,
      contentOpenWithProps,
      contentSidebarProps,
      hasHeader,
      hasProviders,
      history,
      isLarge,
      isVeryLarge,
      logoUrl,
      onClose,
      measureRef,
      sharedLink,
      sharedLinkPassword,
      requestInterceptor,
      responseInterceptor,
      theme
    } = this.props;
    const {
      canPrint,
      currentFileId,
      error,
      file,
      isLoading,
      isReloadNotificationVisible,
      isThumbnailSidebarOpen,
      selectedVersion
    } = this.state;
    const styleClassName = classNames('be bcpr', {
      'bcpr-thumbnails-open': isThumbnailSidebarOpen
    }, className);
    if (!currentFileId) {
      return null;
    }
    const errorCode = getProp(error, 'code');
    const currentExtension = getProp(file, 'id') === currentFileId ? getProp(file, 'extension') : '';
    const currentVersionId = getProp(file, 'file_version.id');
    const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
    const onHeaderClose = currentVersionId === selectedVersionId ? onClose : this.updateVersionToCurrent;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: messages
    }, /*#__PURE__*/React.createElement(APIContext.Provider, {
      value: this.api
    }, /*#__PURE__*/React.createElement(PreviewContext.Provider, {
      value: this.previewContextValue
    }, /*#__PURE__*/React.createElement(Providers, {
      hasProviders: hasProviders
    }, /*#__PURE__*/React.createElement("div", {
      id: this.id,
      className: styleClassName,
      ref: measureRef,
      onKeyDown: this.onKeyDown,
      tabIndex: 0
    }, /*#__PURE__*/React.createElement(ThemingStyles, {
      theme: theme
    }), hasHeader && /*#__PURE__*/React.createElement(PreviewHeader, {
      file: file,
      logoUrl: logoUrl,
      token: token,
      onClose: onHeaderClose,
      onPrint: this.print,
      canDownload: this.canDownload(),
      canPrint: canPrint,
      onDownload: this.download,
      contentAnswersProps: contentAnswersProps,
      contentOpenWithProps: contentOpenWithProps,
      canAnnotate: this.canAnnotate(),
      selectedVersion: selectedVersion
    }), /*#__PURE__*/React.createElement("div", {
      className: "bcpr-body",
      ref: this.previewBodyRef
    }, /*#__PURE__*/React.createElement("div", {
      className: "bcpr-container",
      onMouseMove: this.onMouseMove,
      ref: this.containerRef
    }, file && /*#__PURE__*/React.createElement(Measure, {
      bounds: true,
      onResize: this.onResize
    }, ({
      measureRef: previewRef
    }) => /*#__PURE__*/React.createElement("div", {
      ref: previewRef,
      className: "bcpr-content"
    })), /*#__PURE__*/React.createElement(PreviewMask, {
      errorCode: errorCode,
      extension: currentExtension,
      isLoading: isLoading
    }), /*#__PURE__*/React.createElement(PreviewNavigation, {
      collection: collection,
      currentIndex: this.getFileIndex(),
      onNavigateLeft: this.navigateLeft,
      onNavigateRight: this.navigateRight
    })), file && /*#__PURE__*/React.createElement(LoadableSidebar, _extends({}, contentSidebarProps, {
      apiHost: apiHost,
      token: token,
      cache: this.api.getCache(),
      fileId: currentFileId,
      getPreview: this.getPreview,
      getViewer: this.getViewer,
      history: history,
      isDefaultOpen: isLarge || isVeryLarge,
      language: language,
      ref: this.contentSidebar,
      sharedLink: sharedLink,
      sharedLinkPassword: sharedLinkPassword,
      requestInterceptor: requestInterceptor,
      responseInterceptor: responseInterceptor,
      onAnnotationSelect: this.handleAnnotationSelect,
      onVersionChange: this.onVersionChange
    }))), isReloadNotificationVisible && /*#__PURE__*/React.createElement(ReloadNotification, {
      onClose: this.closeReloadNotification,
      onClick: this.loadFileFromStage
    }))))));
    /* eslint-enable jsx-a11y/no-static-element-interactions */
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
  }
}
_defineProperty(ContentPreview, "defaultProps", {
  apiHost: DEFAULT_HOSTNAME_API,
  appHost: DEFAULT_HOSTNAME_APP,
  autoFocus: false,
  canDownload: true,
  className: '',
  collection: [],
  contentAnswersProps: {},
  contentOpenWithProps: {},
  contentSidebarProps: {},
  enableThumbnailsSidebar: false,
  hasHeader: false,
  language: DEFAULT_LOCALE,
  onAnnotator: noop,
  onAnnotatorEvent: noop,
  onContentInsightsEventReport: noop,
  onDownload: noop,
  onError: noop,
  onLoad: noop,
  onNavigate: noop,
  onPreviewDestroy: noop,
  onVersionChange: noop,
  previewLibraryVersion: DEFAULT_PREVIEW_VERSION,
  showAnnotations: false,
  staticHost: DEFAULT_HOSTNAME_STATIC,
  staticPath: DEFAULT_PATH_STATIC_PREVIEW,
  useHotkeys: true
});
export { ContentPreview as ContentPreviewComponent };
export default flow([makeResponsive, withAnnotatorContext, withAnnotations, withRouter, withNavRouter, withFeatureConsumer, withFeatureProvider, withBlueprintModernization, withLogger(ORIGIN_CONTENT_PREVIEW), withErrorBoundary(ORIGIN_CONTENT_PREVIEW)])(ContentPreview);
//# sourceMappingURL=ContentPreview.js.map