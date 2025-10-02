function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import getProp from 'lodash/get';
import { generatePath, matchPath } from 'react-router-dom';
import AnnotatorContext from './AnnotatorContext';
import { isFeatureEnabled } from '../feature-checking';
import { Action, Status } from './types';
import { FeedEntryType } from '../types/SidebarNavigation';
const ANNOTATIONS_PATH = '/:sidebar/annotations/:fileVersionId/:annotationId?';
const defaultState = {
  action: null,
  activeAnnotationFileVersionId: null,
  activeAnnotationId: null,
  annotation: null,
  annotationReply: null,
  error: null,
  meta: null
};
export default function withAnnotations(WrappedComponent) {
  class ComponentWithAnnotations extends React.Component {
    constructor(props) {
      super(props);
      _defineProperty(this, "annotator", null);
      _defineProperty(this, "emitActiveAnnotationChangeEvent", id => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }
        annotator.emit('annotations_active_set', id);
      });
      _defineProperty(this, "emitAnnotationRemoveEvent", (id, isStartEvent = false) => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }

        // Event name does not include "sidebar" namespace because of backwards compatibility with Preview
        const event = isStartEvent ? 'annotations_remove_start' : 'annotations_remove';
        annotator.emit(event, id);
      });
      _defineProperty(this, "emitAnnotationUpdateEvent", (annotation, isStartEvent = false) => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }
        const event = isStartEvent ? 'sidebar.annotations_update_start' : 'sidebar.annotations_update';
        annotator.emit(event, annotation);
      });
      _defineProperty(this, "emitAnnotationReplyCreateEvent", (reply, requestId, annotationId, isStartEvent = false) => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }
        const event = isStartEvent ? 'sidebar.annotations_reply_create_start' : 'sidebar.annotations_reply_create';
        annotator.emit(event, {
          annotationId,
          reply,
          requestId
        });
      });
      _defineProperty(this, "emitAnnotationReplyDeleteEvent", (id, annotationId, isStartEvent = false) => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }
        const event = isStartEvent ? 'sidebar.annotations_reply_delete_start' : 'sidebar.annotations_reply_delete';
        annotator.emit(event, {
          annotationId,
          id
        });
      });
      _defineProperty(this, "emitAnnotationReplyUpdateEvent", (reply, annotationId, isStartEvent = false) => {
        const {
          annotator
        } = this;
        if (!annotator) {
          return;
        }
        const event = isStartEvent ? 'sidebar.annotations_reply_update_start' : 'sidebar.annotations_reply_update';
        annotator.emit(event, {
          annotationId,
          reply
        });
      });
      _defineProperty(this, "handleAnnotationCreate", eventData => {
        const {
          annotation = null,
          error = null,
          meta = null
        } = eventData;
        const {
          onError
        } = this.props;
        if (onError && error) {
          onError(error, 'create_annotation_error', {
            showNotification: true
          });
        }
        this.setState(_objectSpread(_objectSpread({}, this.state), {}, {
          action: this.getAction(eventData),
          annotation,
          error,
          meta
        }));
      });
      _defineProperty(this, "handleAnnotationDelete", eventData => {
        const {
          annotation = null,
          error = null,
          meta = null
        } = eventData;
        this.setState({
          action: this.getDeleteAction(eventData),
          annotation,
          error,
          meta
        });
      });
      _defineProperty(this, "handleAnnotationUpdate", eventData => {
        const {
          annotation = null,
          error = null,
          meta = null
        } = eventData;
        this.setState({
          action: this.getUpdateAction(eventData),
          annotation,
          error,
          meta
        });
      });
      _defineProperty(this, "handleAnnotationReplyCreate", eventData => {
        const {
          annotation = null,
          annotationReply = null,
          error = null,
          meta = null
        } = eventData;
        this.setState({
          action: this.getReplyCreateAction(eventData),
          annotation,
          annotationReply,
          error,
          meta
        });
      });
      _defineProperty(this, "handleAnnotationReplyDelete", eventData => {
        const {
          annotation = null,
          annotationReply = null,
          error = null,
          meta = null
        } = eventData;
        this.setState({
          action: this.getReplyDeleteAction(eventData),
          annotation,
          annotationReply,
          error,
          meta
        });
      });
      _defineProperty(this, "handleAnnotationReplyUpdate", eventData => {
        const {
          annotation = null,
          annotationReply = null,
          error = null,
          meta = null
        } = eventData;
        this.setState({
          action: this.getReplyUpdateAction(eventData),
          annotation,
          annotationReply,
          error,
          meta
        });
      });
      _defineProperty(this, "handleActiveChange", ({
        annotationId,
        fileVersionId
      }) => {
        this.setState({
          activeAnnotationFileVersionId: fileVersionId,
          activeAnnotationId: annotationId
        });
      });
      _defineProperty(this, "handleAnnotationFetchError", ({
        error
      }) => {
        const {
          onError
        } = this.props;
        if (onError && error) {
          onError(error, 'fetch_annotations_error', {
            showNotification: true
          });
        }
      });
      _defineProperty(this, "handleAnnotator", annotator => {
        this.annotator = annotator;
        this.annotator.addListener('annotations_active_change', this.handleActiveChange);
        this.annotator.addListener('annotations_create', this.handleAnnotationCreate);
        this.annotator.addListener('annotations_delete', this.handleAnnotationDelete);
        this.annotator.addListener('annotations_fetch_error', this.handleAnnotationFetchError);
        this.annotator.addListener('annotations_update', this.handleAnnotationUpdate);
        this.annotator.addListener('annotations_reply_create', this.handleAnnotationReplyCreate);
        this.annotator.addListener('annotations_reply_delete', this.handleAnnotationReplyDelete);
        this.annotator.addListener('annotations_reply_update', this.handleAnnotationReplyUpdate);
      });
      _defineProperty(this, "handlePreviewDestroy", (shouldReset = true) => {
        if (shouldReset) {
          this.setState(defaultState);
        }
        if (this.annotator) {
          this.annotator.removeListener('annotations_active_change', this.handleActiveChange);
          this.annotator.removeListener('annotations_create', this.handleAnnotationCreate);
          this.annotator.removeListener('annotations_delete', this.handleAnnotationDelete);
          this.annotator.removeListener('annotations_fetch_error', this.handleAnnotationFetchError);
          this.annotator.removeListener('annotations_update', this.handleAnnotationUpdate);
          this.annotator.removeListener('annotations_reply_create', this.handleAnnotationReplyCreate);
          this.annotator.removeListener('annotations_reply_delete', this.handleAnnotationReplyDelete);
          this.annotator.removeListener('annotations_reply_update', this.handleAnnotationReplyUpdate);
        }
        this.annotator = null;
      });
      const {
        routerDisabled,
        sidebarNavigation
      } = props;
      let activeAnnotationId = null;
      const isRouterDisabled = routerDisabled || isFeatureEnabled(props?.features, 'routerDisabled.value');
      if (isRouterDisabled) {
        if (sidebarNavigation && 'activeFeedEntryType' in sidebarNavigation && sidebarNavigation.activeFeedEntryType === FeedEntryType.ANNOTATIONS && 'activeFeedEntryId' in sidebarNavigation) {
          activeAnnotationId = sidebarNavigation.activeFeedEntryId;
        }
      } else {
        // Determine by url if there is already a deeply linked annotation
        const {
          location
        } = props;
        const match = this.getMatchPath(location);
        activeAnnotationId = getProp(match, 'params.annotationId', null);
      }

      // Seed the initial state with the activeAnnotationId if any from the location path
      this.state = _objectSpread(_objectSpread({}, defaultState), {}, {
        activeAnnotationId
      });
    }
    getAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.CREATE_END : Action.CREATE_START;
    }
    getDeleteAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.DELETE_END : Action.DELETE_START;
    }
    getUpdateAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.UPDATE_END : Action.UPDATE_START;
    }
    getReplyCreateAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.REPLY_CREATE_END : Action.REPLY_CREATE_START;
    }
    getReplyDeleteAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.REPLY_DELETE_END : Action.REPLY_DELETE_START;
    }
    getReplyUpdateAction({
      meta: {
        status
      },
      error
    }) {
      return status === Status.SUCCESS || error ? Action.REPLY_UPDATE_END : Action.REPLY_UPDATE_START;
    }
    getAnnotationsPath(fileVersionId, annotationId) {
      if (!fileVersionId) {
        return '/activity';
      }
      return generatePath(ANNOTATIONS_PATH, {
        sidebar: 'activity',
        annotationId: annotationId || undefined,
        fileVersionId
      });
    }

    // remove this method with routerDisabled switch
    getMatchPath(location) {
      const pathname = getProp(location, 'pathname', '');
      return matchPath(pathname, {
        path: ANNOTATIONS_PATH,
        exact: true
      });
    }
    render() {
      const isRouterDisabled = this.props?.routerDisabled || isFeatureEnabled(this.props?.features, 'routerDisabled.value');
      const annotationsRouterProps = isRouterDisabled ? {} : {
        getAnnotationsMatchPath: this.getMatchPath,
        getAnnotationsPath: this.getAnnotationsPath
      };
      return /*#__PURE__*/React.createElement(AnnotatorContext.Provider, {
        value: _objectSpread(_objectSpread({
          emitActiveAnnotationChangeEvent: this.emitActiveAnnotationChangeEvent,
          emitAnnotationRemoveEvent: this.emitAnnotationRemoveEvent,
          emitAnnotationReplyCreateEvent: this.emitAnnotationReplyCreateEvent,
          emitAnnotationReplyDeleteEvent: this.emitAnnotationReplyDeleteEvent,
          emitAnnotationReplyUpdateEvent: this.emitAnnotationReplyUpdateEvent,
          emitAnnotationUpdateEvent: this.emitAnnotationUpdateEvent
        }, annotationsRouterProps), {}, {
          state: this.state
        })
      }, /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, this.props, {
        onAnnotator: this.handleAnnotator,
        onPreviewDestroy: this.handlePreviewDestroy
      })));
    }
  }
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithAnnotations.displayName = `WithAnnotations(${displayName})`;
  return ComponentWithAnnotations;
}
//# sourceMappingURL=withAnnotations.js.map