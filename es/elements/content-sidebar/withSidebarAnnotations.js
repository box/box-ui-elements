function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { matchPath } from 'react-router-dom';
import { FEED_ITEM_TYPE_VERSION } from '../../constants';
import { getBadUserError } from '../../utils/error';
import { ViewType, FeedEntryType } from '../common/types/SidebarNavigation';
export default function withSidebarAnnotations(WrappedComponent) {
  class WithSidebarAnnotations extends React.Component {
    constructor(props) {
      super(props);
      _defineProperty(this, "sidebarPanels", /*#__PURE__*/React.createRef());
      _defineProperty(this, "getInternalNavigationMatch", navigation => {
        if (!('activeFeedEntryType' in navigation) || navigation.activeFeedEntryType !== FeedEntryType.ANNOTATIONS || !navigation.fileVersionId) {
          return null;
        }

        // Only include annotationId if it's defined (mirrors router behavior where missing optional params are omitted)
        const params = navigation.activeFeedEntryId !== undefined ? {
          fileVersionId: navigation.fileVersionId,
          annotationId: navigation.activeFeedEntryId
        } : {
          fileVersionId: navigation.fileVersionId
        };
        return {
          params
        };
      });
      _defineProperty(this, "getInternalAnnotationsNavigation", (fileVersionId, annotationId) => {
        if (!fileVersionId) {
          return {
            sidebar: ViewType.ACTIVITY
          };
        }
        return {
          sidebar: ViewType.ACTIVITY,
          activeFeedEntryType: FeedEntryType.ANNOTATIONS,
          activeFeedEntryId: annotationId || undefined,
          fileVersionId
        };
      });
      _defineProperty(this, "redirectDeeplinkedAnnotation", () => {
        const {
          file,
          getAnnotationsPath,
          getAnnotationsMatchPath,
          history,
          internalSidebarNavigation,
          internalSidebarNavigationHandler,
          location,
          routerDisabled
        } = this.props;
        const currentFileVersionId = getProp(file, 'file_version.id');
        if (routerDisabled && internalSidebarNavigation && internalSidebarNavigationHandler) {
          // Use internal navigation when router is disabled
          const match = this.getInternalNavigationMatch(internalSidebarNavigation);
          const annotationId = getProp(match, 'params.annotationId');
          const fileVersionId = getProp(match, 'params.fileVersionId');
          if (fileVersionId && fileVersionId !== currentFileVersionId) {
            const correctedNavigation = this.getInternalAnnotationsNavigation(currentFileVersionId, annotationId);
            internalSidebarNavigationHandler(correctedNavigation, true);
          }
        } else {
          // Use router-based navigation
          const match = getAnnotationsMatchPath(location);
          const annotationId = getProp(match, 'params.annotationId');
          const fileVersionId = getProp(match, 'params.fileVersionId');
          if (fileVersionId && fileVersionId !== currentFileVersionId) {
            history.replace(getAnnotationsPath(currentFileVersionId, annotationId));
          }
        }
      });
      _defineProperty(this, "updateActiveAnnotation", () => {
        const {
          annotatorState: {
            activeAnnotationFileVersionId,
            activeAnnotationId
          },
          file,
          getAnnotationsMatchPath,
          getAnnotationsPath,
          history,
          internalSidebarNavigation,
          internalSidebarNavigationHandler,
          location,
          routerDisabled
        } = this.props;
        const currentFileVersionId = getProp(file, 'file_version.id');
        const defaultFileVersionId = activeAnnotationFileVersionId || currentFileVersionId;
        if (routerDisabled && internalSidebarNavigation && internalSidebarNavigationHandler) {
          // Use internal navigation when router is disabled
          const match = this.getInternalNavigationMatch(internalSidebarNavigation);
          const fileVersionId = getProp(match, 'params.fileVersionId', defaultFileVersionId);
          const newNavigationState = activeAnnotationId ? {
            open: true
          } : {};

          // Update the navigation and open state if transitioning to an active annotation id, force the sidebar open
          const updatedNavigation = _objectSpread(_objectSpread({}, this.getInternalAnnotationsNavigation(fileVersionId, activeAnnotationId)), newNavigationState);
          internalSidebarNavigationHandler(updatedNavigation);
        } else {
          // Use router-based navigation
          const match = getAnnotationsMatchPath(location);
          const fileVersionId = getProp(match, 'params.fileVersionId', defaultFileVersionId);
          const newLocationState = activeAnnotationId ? {
            open: true
          } : location.state;

          // Update the location pathname and open state if transitioning to an active annotation id, force the sidebar open
          history.push({
            pathname: getAnnotationsPath(fileVersionId, activeAnnotationId),
            state: newLocationState
          });
        }
      });
      _defineProperty(this, "updateActiveVersion", () => {
        const {
          api,
          file,
          fileId,
          getAnnotationsMatchPath,
          getAnnotationsPath,
          history,
          internalSidebarNavigation,
          internalSidebarNavigationHandler,
          location,
          onVersionChange,
          routerDisabled
        } = this.props;
        const feedAPI = api.getFeedAPI(false);
        const currentFileVersionId = getProp(file, 'file_version.id');
        const {
          items: feedItems = []
        } = feedAPI.getCachedItems(fileId) || {};
        if (routerDisabled && internalSidebarNavigation && internalSidebarNavigationHandler) {
          // Use internal navigation when router is disabled
          const match = this.getInternalNavigationMatch(internalSidebarNavigation);
          const fileVersionId = getProp(match, 'params.fileVersionId');
          const version = feedItems.filter(item => item.type === FEED_ITEM_TYPE_VERSION).find(item => item.id === fileVersionId);
          if (version) {
            onVersionChange(version, {
              currentVersionId: currentFileVersionId,
              updateVersionToCurrent: () => {
                const currentVersionNavigation = this.getInternalAnnotationsNavigation(currentFileVersionId);
                internalSidebarNavigationHandler(currentVersionNavigation);
              }
            });
          }
        } else {
          // Use router-based navigation
          const match = getAnnotationsMatchPath(location);
          const fileVersionId = getProp(match, 'params.fileVersionId');
          const version = feedItems.filter(item => item.type === FEED_ITEM_TYPE_VERSION).find(item => item.id === fileVersionId);
          if (version) {
            onVersionChange(version, {
              currentVersionId: currentFileVersionId,
              updateVersionToCurrent: () => history.push(getAnnotationsPath(currentFileVersionId))
            });
          }
        }
      });
      _defineProperty(this, "refreshActivitySidebar", () => {
        const {
          internalSidebarNavigation,
          isOpen,
          location,
          routerDisabled
        } = this.props;
        const {
          current
        } = this.sidebarPanels;
        let isActivity = false;
        if (routerDisabled && internalSidebarNavigation) {
          // Check if current navigation is pointing to activity sidebar
          isActivity = internalSidebarNavigation.sidebar === ViewType.ACTIVITY;
        } else {
          // Use router-based check
          const pathname = getProp(location, 'pathname', '');
          isActivity = !!matchPath(pathname, '/activity');
        }

        // If the activity sidebar is currently open, then force it to refresh with the updated data
        if (current && isActivity && isOpen) {
          current.refresh(false);
        }
      });
      this.redirectDeeplinkedAnnotation();
    }
    componentDidUpdate(prevProps) {
      const {
        annotatorState,
        fileId,
        getAnnotationsMatchPath,
        internalSidebarNavigation,
        location,
        onVersionChange,
        routerDisabled
      } = this.props;
      const {
        annotatorState: prevAnnotatorState,
        fileId: prevFileId,
        internalSidebarNavigation: prevInternalSidebarNavigation,
        location: prevLocation
      } = prevProps;
      const {
        action,
        activeAnnotationId,
        annotation
      } = annotatorState;
      const {
        activeAnnotationId: prevActiveAnnotationId,
        annotation: prevAnnotation
      } = prevAnnotatorState;
      let fileVersionId;
      let prevFileVersionId;
      let match;
      if (routerDisabled && internalSidebarNavigation) {
        // Use internal navigation when router is disabled
        match = this.getInternalNavigationMatch(internalSidebarNavigation);
        const prevMatch = prevInternalSidebarNavigation ? this.getInternalNavigationMatch(prevInternalSidebarNavigation) : null;
        fileVersionId = getProp(match, 'params.fileVersionId');
        prevFileVersionId = getProp(prevMatch, 'params.fileVersionId');
      } else {
        // Use router-based navigation
        match = getAnnotationsMatchPath(location);
        const prevMatch = getAnnotationsMatchPath(prevLocation);
        fileVersionId = getProp(match, 'params.fileVersionId');
        prevFileVersionId = getProp(prevMatch, 'params.fileVersionId');
      }
      const isAnnotationsPath = !!match;
      const isTransitioningToAnnotationPath = activeAnnotationId && !isAnnotationsPath;
      const hasActiveAnnotationChanged = prevActiveAnnotationId !== activeAnnotationId;
      if (action === 'reply_create_start' || action === 'reply_create_end') {
        this.addAnnotationReply();
      }
      if (action === 'reply_delete_start' || action === 'reply_delete_end') {
        this.deleteAnnotationReply();
      }
      if (action === 'reply_update_start' || action === 'reply_update_end') {
        this.updateAnnotationReply();
      }
      if (action === 'update_start' || action === 'update_end') {
        this.updateAnnotation();
      }
      if (action === 'delete_start' || action === 'delete_end') {
        this.deleteAnnotation();
      }
      if ((action === 'create_start' || action === 'create_end') && annotation && prevAnnotation !== annotation) {
        this.addAnnotation();
      }

      // Active annotation id changed. If location is currently an annotation path or
      // if location is not currently an annotation path but the active annotation id
      // transitioned from falsy to truthy, update the location accordingly
      if (hasActiveAnnotationChanged && (isAnnotationsPath || isTransitioningToAnnotationPath)) {
        this.updateActiveAnnotation();
      }
      if (fileVersionId && prevFileVersionId !== fileVersionId) {
        this.updateActiveVersion();
      }
      if (prevFileId !== fileId) {
        // If the file id has changed, reset the current version id since the previous (possibly versioned)
        // location is no longer active
        onVersionChange(null);
      }
    }
    addAnnotation() {
      const {
        annotatorState: {
          action,
          annotation,
          meta: {
            requestId
          } = {}
        },
        api,
        currentUser,
        file,
        fileId
      } = this.props;
      if (!requestId) {
        return;
      }

      // TODO: need to address in follow on -- currentUser may be undefined here but is never fetched for sure until ActivitySidebar
      if (!currentUser) {
        throw getBadUserError();
      }
      const feedAPI = api.getFeedAPI(false);
      const isPending = action === 'create_start';
      const {
        items: hasItems
      } = feedAPI.getCachedItems(fileId) || {};

      // If there are existing items in the cache for this file, then patch the cache with the new annotation
      // If there are no cache entry for feeditems, then it is assumed that it has not yet been fetched.
      if (hasItems) {
        feedAPI.addAnnotation(file, currentUser, annotation, requestId, isPending);
      }
      this.refreshActivitySidebar();
    }
    addAnnotationReply() {
      const {
        annotatorState: {
          action,
          annotation: {
            id: annotationId
          },
          annotationReply,
          meta: {
            requestId
          }
        },
        api,
        currentUser,
        file
      } = this.props;
      if (!currentUser) {
        throw getBadUserError();
      }
      const feedAPI = api.getFeedAPI(false);
      feedAPI.file = file;
      if (action === 'reply_create_start') {
        feedAPI.addPendingReply(annotationId, currentUser, _objectSpread(_objectSpread({}, annotationReply), {}, {
          id: requestId
        }));
      } else {
        const {
          items: feedItems = []
        } = feedAPI.getCachedItems(file.id) || {};
        const annotationItem = feedItems.find(({
          id
        }) => id === annotationId);
        if (!annotationItem) {
          return;
        }
        feedAPI.modifyFeedItemRepliesCountBy(annotationId, 1);
        feedAPI.updateReplyItem(_objectSpread(_objectSpread({}, annotationReply), {}, {
          isPending: false
        }), annotationId, requestId);
      }
      this.refreshActivitySidebar();
    }
    deleteAnnotation() {
      const {
        annotatorState: {
          action,
          annotation
        },
        api,
        file
      } = this.props;
      const feedAPI = api.getFeedAPI(false);
      feedAPI.file = file;
      if (action === 'delete_start') {
        feedAPI.updateFeedItem({
          isPending: true
        }, annotation.id);
      } else {
        feedAPI.deleteFeedItem(annotation.id);
      }
      this.refreshActivitySidebar();
    }
    deleteAnnotationReply() {
      const {
        annotatorState: {
          action,
          annotation: {
            id: annotationId
          },
          annotationReply: {
            id: replyId
          }
        },
        api,
        file
      } = this.props;
      const feedAPI = api.getFeedAPI(false);
      feedAPI.file = file;
      if (action === 'reply_delete_start') {
        feedAPI.updateReplyItem({
          isPending: true
        }, annotationId, replyId);
      } else {
        const {
          items: feedItems = []
        } = feedAPI.getCachedItems(file.id) || {};
        const annotationItem = feedItems.find(({
          id
        }) => id === annotationId);
        if (!annotationItem) {
          return;
        }

        // Check if the parent annotation has the reply currently visible and if so, remove it
        const replyItem = annotationItem.replies.find(({
          id
        }) => id === replyId);
        if (replyItem) {
          feedAPI.deleteReplyItem(replyId, annotationId);
        }

        // Decrease the amount of replies by 1
        feedAPI.modifyFeedItemRepliesCountBy(annotationId, -1);
      }
      this.refreshActivitySidebar();
    }
    updateAnnotation() {
      const {
        annotatorState: {
          action,
          annotation
        },
        api,
        file
      } = this.props;
      const feedAPI = api.getFeedAPI(false);
      const isPending = action === 'update_start';
      feedAPI.file = file;
      feedAPI.updateFeedItem(_objectSpread(_objectSpread({}, annotation), {}, {
        isPending
      }), annotation.id);
      this.refreshActivitySidebar();
    }
    updateAnnotationReply() {
      const {
        annotatorState: {
          action,
          annotation,
          annotationReply
        },
        api,
        file
      } = this.props;
      const feedAPI = api.getFeedAPI(false);
      const isPending = action === 'reply_update_start';
      feedAPI.file = file;
      feedAPI.updateReplyItem(_objectSpread(_objectSpread({}, annotationReply), {}, {
        isPending
      }), annotation.id, annotationReply.id);
      this.refreshActivitySidebar();
    }
    render() {
      return /*#__PURE__*/React.createElement(WrappedComponent, _extends({
        ref: this.sidebarPanels
      }, this.props));
    }
  }
  _defineProperty(WithSidebarAnnotations, "defaultProps", {
    annotatorState: {},
    getAnnotationsMatchPath: noop,
    getAnnotationsPath: noop,
    onVersionChange: noop
  });
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithSidebarAnnotations.displayName = `WithSidebarAnnotations(${displayName})`;
  return WithSidebarAnnotations;
}
//# sourceMappingURL=withSidebarAnnotations.js.map