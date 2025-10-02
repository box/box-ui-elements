function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ActiveState from './ActiveState';
import CommentForm from '../comment-form';
import EmptyState from './EmptyState';
import InlineError from '../../../../components/inline-error/InlineError';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import messages from './messages';
import { collapseFeedState, ItemTypes } from './activityFeedUtils';
import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK, PERMISSION_CAN_CREATE_ANNOTATIONS } from '../../../../constants';
import { scrollIntoView } from '../../../../utils/dom';
import './ActivityFeed.scss';
class ActivityFeed extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isScrolled: false,
      isInputOpen: false,
      selectedItemId: null
    });
    _defineProperty(this, "activeFeedItemRef", /*#__PURE__*/React.createRef());
    /**
     * Detects whether or not the empty state should be shown.
     * @param {object} currentUser - The user that is logged into the account
     * @param {object} feedItems - Items in the activity feed
     */
    _defineProperty(this, "isEmpty", ({
      feedItems,
      shouldUseUAA,
      activityFeedError
    } = this.props) => {
      if (feedItems === undefined || shouldUseUAA && activityFeedError) {
        return false;
      }
      return feedItems.length === 0 || !shouldUseUAA && feedItems.length === 1 && feedItems[0].type === ItemTypes.fileVersion || !!shouldUseUAA && feedItems.length === 1 && feedItems[0].type === ItemTypes.fileVersion && feedItems[0].version_start === 1 && feedItems[0].version_end === 1;
    });
    /**
     * Determines whether currentUser and feedItems have loaded.
     * @param prevCurrentUser - The previous value of the currentUser prop
     * @param prevFeedItems - The previous value of the feedItems prop
     * @returns {boolean}
     */
    _defineProperty(this, "hasLoaded", (prevCurrentUser, prevFeedItems) => {
      const {
        currentUser,
        feedItems
      } = this.props;
      return currentUser !== undefined && feedItems !== undefined && (!prevCurrentUser || !prevFeedItems);
    });
    /**
     * Scrolls the container to the bottom
     */
    _defineProperty(this, "resetFeedScroll", () => {
      if (this.feedContainer) {
        this.feedContainer.scrollTop = this.feedContainer.scrollHeight;
      }
    });
    _defineProperty(this, "handleFeedScroll", event => {
      const {
        target
      } = event;
      if (target instanceof Element) {
        const {
          scrollTop
        } = target;
        this.setState({
          isScrolled: scrollTop > 0
        });
      }
    });
    _defineProperty(this, "throttledFeedScroll", throttle(this.handleFeedScroll, 100));
    _defineProperty(this, "onKeyDown", event => {
      const {
        nativeEvent
      } = event;
      nativeEvent.stopImmediatePropagation();
    });
    _defineProperty(this, "commentFormFocusHandler", () => {
      this.resetFeedScroll();
      this.setState({
        isInputOpen: true
      });
    });
    _defineProperty(this, "commentFormCancelHandler", () => this.setState({
      isInputOpen: false
    }));
    _defineProperty(this, "commentFormSubmitHandler", () => this.setState({
      isInputOpen: false
    }));
    _defineProperty(this, "onCommentCreate", ({
      text,
      hasMention
    }) => {
      const {
        onCommentCreate = noop
      } = this.props;
      onCommentCreate(text, hasMention);
      this.commentFormSubmitHandler();
    });
    /**
     * Creates a task.
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    _defineProperty(this, "onTaskCreate", ({
      text,
      assignees,
      dueAt
    }) => {
      const {
        onTaskCreate = noop
      } = this.props;
      onTaskCreate(text, assignees, dueAt);
      this.commentFormSubmitHandler();
    });
    /**
     * Invokes version history popup handler.
     *
     * @param {Object} data - Version history data
     * @return {void}
     */
    _defineProperty(this, "openVersionHistoryPopup", data => {
      const versionInfoHandler = this.props.onVersionHistoryClick || noop;
      versionInfoHandler(data);
    });
    _defineProperty(this, "setSelectedItem", itemId => {
      const {
        hasReplies
      } = this.props;
      if (!hasReplies) {
        return;
      }
      this.setState({
        selectedItemId: itemId
      });
    });
    _defineProperty(this, "isFeedItemActive", ({
      id,
      type
    }) => {
      const {
        activeFeedEntryId,
        activeFeedEntryType
      } = this.props;
      const {
        selectedItemId
      } = this.state;
      const isSelected = selectedItemId === id;
      return selectedItemId ? isSelected : id === activeFeedEntryId && type === activeFeedEntryType;
    });
    _defineProperty(this, "isCommentFeedItemActive", item => {
      const {
        activeFeedEntryId
      } = this.props;
      const {
        replies
      } = item;
      const isActive = this.isFeedItemActive(item);
      return isActive || !!replies && replies.some(reply => reply.id === activeFeedEntryId);
    });
  }
  componentDidMount() {
    this.resetFeedScroll();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      activeFeedEntryId: prevActiveFeedEntryId,
      currentUser: prevCurrentUser,
      feedItems: prevFeedItems
    } = prevProps;
    const {
      feedItems: currFeedItems,
      activeFeedEntryId
    } = this.props;
    const {
      isInputOpen: prevIsInputOpen
    } = prevState;
    const {
      isInputOpen: currIsInputOpen
    } = this.state;
    const hasLoaded = this.hasLoaded(prevCurrentUser, prevFeedItems);
    const hasMoreItems = prevFeedItems && currFeedItems && prevFeedItems.length < currFeedItems.length;
    const didLoadFeedItems = prevFeedItems === undefined && currFeedItems !== undefined;
    const hasInputOpened = currIsInputOpen !== prevIsInputOpen;
    const hasActiveFeedEntryIdChanged = activeFeedEntryId !== prevActiveFeedEntryId;
    if ((hasLoaded || hasMoreItems || didLoadFeedItems || hasInputOpened) && activeFeedEntryId === undefined) {
      this.resetFeedScroll();
    }
    if (didLoadFeedItems || hasActiveFeedEntryIdChanged) {
      this.scrollToActiveFeedItemOrErrorMessage();
    }
  }
  scrollToActiveFeedItemOrErrorMessage() {
    const {
      current: activeFeedItemRef
    } = this.activeFeedItemRef;
    const {
      activeFeedEntryId
    } = this.props;

    // if there is no active item, do not scroll
    if (!activeFeedEntryId) {
      return;
    }

    // if there was supposed to be an active feed item but the feed item does not exist
    // scroll to the bottom to show the inline error message
    if (activeFeedItemRef === null) {
      this.resetFeedScroll();
      return;
    }
    scrollIntoView(activeFeedItemRef);
  }
  render() {
    const {
      activeFeedEntryType,
      activityFeedError,
      approverSelectorContacts,
      currentUser,
      feedItems,
      file,
      getApproverWithQuery,
      getAvatarUrl,
      getMentionWithQuery,
      getUserProfileUrl,
      hasNewThreadedReplies,
      hasReplies,
      hasVersions,
      isDisabled,
      mentionSelectorContacts,
      contactsLoaded,
      onAnnotationDelete,
      onAnnotationEdit,
      onAnnotationSelect,
      onAnnotationStatusChange,
      onAppActivityDelete,
      onCommentCreate,
      onCommentDelete,
      onCommentUpdate,
      onHideReplies,
      onReplyCreate,
      onReplyDelete,
      onReplyUpdate,
      onShowReplies,
      onTaskAssignmentUpdate,
      onTaskDelete,
      onTaskModalClose,
      onTaskUpdate,
      onTaskView,
      onVersionHistoryClick,
      shouldUseUAA,
      translations
    } = this.props;
    const {
      isInputOpen,
      isScrolled
    } = this.state;
    const currentFileVersionId = getProp(file, 'file_version.id');
    const hasAnnotationCreatePermission = getProp(file, ['permissions', PERMISSION_CAN_CREATE_ANNOTATIONS], false);
    const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
    const showCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate && feedItems);
    const isEmpty = this.isEmpty(this.props);
    const isLoading = !this.hasLoaded();
    const activeFeedItem = Array.isArray(feedItems) && feedItems.find(item => {
      switch (item.type) {
        case FEED_ITEM_TYPE_ANNOTATION:
          return this.isCommentFeedItemActive(item);
        case FEED_ITEM_TYPE_COMMENT:
          return this.isCommentFeedItemActive(item);
        case FEED_ITEM_TYPE_TASK:
          return this.isFeedItemActive(item);
        default:
          return false;
      }
    });
    const errorMessageByEntryType = {
      annotation: messages.annotationMissingError,
      comment: messages.commentMissingError,
      task: messages.taskMissingError
    };
    const inlineFeedItemErrorMessage = activeFeedEntryType ? errorMessageByEntryType[activeFeedEntryType] : undefined;
    const isInlineFeedItemErrorVisible = !isLoading && activeFeedEntryType && !activeFeedItem;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        className: classNames('bcs-activity-feed', {
          'bcs-is-scrolled': isScrolled
        }),
        "data-testid": isScrolled ? 'activityfeedscrolled' : 'activityfeed',
        onKeyDown: this.onKeyDown
      }, /*#__PURE__*/React.createElement("div", {
        ref: ref => {
          this.feedContainer = ref;
        },
        className: "bcs-activity-feed-items-container",
        onScroll: this.throttledFeedScroll
      }, isLoading && /*#__PURE__*/React.createElement("div", {
        className: "bcs-activity-feed-loading-state"
      }, /*#__PURE__*/React.createElement(LoadingIndicator, null)), isEmpty && !isLoading && /*#__PURE__*/React.createElement(EmptyState, {
        showAnnotationMessage: hasAnnotationCreatePermission,
        showCommentMessage: showCommentForm
      }), !isEmpty && !isLoading && /*#__PURE__*/React.createElement(ActiveState, _extends({}, activityFeedError, {
        activeFeedItem: activeFeedItem,
        activeFeedItemRef: this.activeFeedItemRef,
        approverSelectorContacts: approverSelectorContacts,
        currentFileVersionId: currentFileVersionId,
        currentUser: currentUser,
        file: file,
        getApproverWithQuery: getApproverWithQuery,
        getAvatarUrl: getAvatarUrl,
        getMentionWithQuery: getMentionWithQuery,
        getUserProfileUrl: getUserProfileUrl,
        hasNewThreadedReplies: hasNewThreadedReplies,
        hasReplies: hasReplies,
        hasVersions: hasVersions,
        isDisabled: isDisabled,
        items: shouldUseUAA ? feedItems : collapseFeedState(feedItems),
        mentionSelectorContacts: mentionSelectorContacts,
        onAnnotationDelete: onAnnotationDelete,
        onAnnotationEdit: onAnnotationEdit,
        onAnnotationSelect: onAnnotationSelect,
        onAnnotationStatusChange: onAnnotationStatusChange,
        onAppActivityDelete: onAppActivityDelete,
        onCommentDelete: hasCommentPermission ? onCommentDelete : noop,
        onCommentEdit: hasCommentPermission && onCommentUpdate ? props => {
          onCommentUpdate(props.id, props.text, props.status, props.hasMention, props.permissions, props.onSuccess, props.onError);
        } : noop,
        onCommentSelect: this.setSelectedItem,
        onHideReplies: onHideReplies,
        onReplyCreate: hasCommentPermission ? onReplyCreate : noop,
        onReplyDelete: hasCommentPermission ? onReplyDelete : noop,
        onReplyUpdate: hasCommentPermission ? onReplyUpdate : noop,
        onShowReplies: onShowReplies,
        onTaskAssignmentUpdate: onTaskAssignmentUpdate,
        onTaskDelete: onTaskDelete,
        onTaskEdit: onTaskUpdate,
        onTaskModalClose: onTaskModalClose,
        onTaskView: onTaskView,
        onVersionInfo: onVersionHistoryClick ? this.openVersionHistoryPopup : null,
        shouldUseUAA: shouldUseUAA,
        translations: translations
      })), isInlineFeedItemErrorVisible && inlineFeedItemErrorMessage && /*#__PURE__*/React.createElement(InlineError, {
        title: /*#__PURE__*/React.createElement(FormattedMessage, messages.feedInlineErrorTitle),
        className: "bcs-feedItemInlineError"
      }, /*#__PURE__*/React.createElement(FormattedMessage, inlineFeedItemErrorMessage))), showCommentForm ? /*#__PURE__*/React.createElement(CommentForm, {
        onSubmit: this.resetFeedScroll,
        isDisabled: isDisabled,
        mentionSelectorContacts: mentionSelectorContacts,
        contactsLoaded: contactsLoaded,
        className: classNames('bcs-activity-feed-comment-input', {
          'bcs-is-disabled': isDisabled
        }),
        createComment: hasCommentPermission ? this.onCommentCreate : noop,
        file: file,
        getMentionWithQuery: getMentionWithQuery,
        isOpen: isInputOpen
        // $FlowFixMe
        ,
        user: currentUser,
        onCancel: this.commentFormCancelHandler,
        onFocus: this.commentFormFocusHandler,
        getAvatarUrl: getAvatarUrl
      }) : null)
    );
  }
}
export default ActivityFeed;
//# sourceMappingURL=ActivityFeed.js.map