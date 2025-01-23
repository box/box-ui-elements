// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { matchPath } from '../common/routing/utils';
import { FEED_ITEM_TYPE_VERSION } from '../../constants';
import { getBadUserError } from '../../utils/error';

/**
 * @typedef {Object} Props
 * @property {Object} [currentUser]
 * @property {Object} file
 * @property {string} fileId
 * @property {boolean} isOpen
 * @property {Function} onVersionChange
 * @property {Object} history
 * @property {Object} location
 * @property {Object} match
 */

/**
 * @typedef {Object} SidebarPanelsRefType
 * @property {(shouldRefreshCache?: boolean) => void} refresh
 */

/**
 * @param {React.ComponentType} WrappedComponent
 * @returns {React.ComponentType}
 */
export default function withSidebarAnnotations(WrappedComponent) {
    /** @extends {React.Component} */
    class WithSidebarAnnotations extends React.Component {
        static defaultProps = {
            annotatorState: {},
            getAnnotationsMatchPath: noop,
            getAnnotationsPath: noop,
            onVersionChange: noop,
        };

        static displayName: ?string;

        props: Props;

        sidebarPanels: { current: SidebarPanelsRefType | null } = React.createRef();

        constructor(props) {
            super(props);

            this.redirectDeeplinkedAnnotation();
        }

        redirectDeeplinkedAnnotation = () => {
            const { file, getAnnotationsPath, getAnnotationsMatchPath, history, location } = this.props;
            const match = getAnnotationsMatchPath(location);
            const annotationId = getProp(match, 'params.annotationId');
            const currentFileVersionId = getProp(file, 'file_version.id');
            const fileVersionId = getProp(match, 'params.fileVersionId');

            if (fileVersionId && fileVersionId !== currentFileVersionId) {
                history.replace(getAnnotationsPath(currentFileVersionId, annotationId));
            }
        };

        componentDidUpdate(prevProps: Props) {
            const { annotatorState, fileId, getAnnotationsMatchPath, location, onVersionChange }: Props = this.props;
            const { annotatorState: prevAnnotatorState, fileId: prevFileId, location: prevLocation }: Props = prevProps;
            const { action, activeAnnotationId, annotation } = annotatorState;
            const { activeAnnotationId: prevActiveAnnotationId, annotation: prevAnnotation } = prevAnnotatorState;

            const match = getAnnotationsMatchPath(location);
            const prevMatch = getAnnotationsMatchPath(prevLocation);
            const fileVersionId = getProp(match, 'params.fileVersionId');
            const hasActiveAnnotationChanged = prevActiveAnnotationId !== activeAnnotationId;
            const isAnnotationsPath = !!match;
            const isTransitioningToAnnotationPath = activeAnnotationId && !isAnnotationsPath;
            const prevFileVersionId = getProp(prevMatch, 'params.fileVersionId');

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
                annotatorState: { action, annotation, meta: { requestId } = {} },
                api,
                currentUser,
                file,
                fileId,
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
            const { items: hasItems } = feedAPI.getCachedItems(fileId) || {};

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
                    annotation: { id: annotationId },
                    annotationReply,
                    meta: { requestId },
                },
                api,
                currentUser,
                file,
            } = this.props;

            if (!currentUser) {
                throw getBadUserError();
            }

            const feedAPI = api.getFeedAPI(false);
            feedAPI.file = file;

            if (action === 'reply_create_start') {
                feedAPI.addPendingReply(annotationId, currentUser, { ...annotationReply, id: requestId });
            } else {
                const { items: feedItems = [] } = feedAPI.getCachedItems(file.id) || {};
                const annotationItem = feedItems.find(({ id }) => id === annotationId);

                if (!annotationItem) {
                    return;
                }

                feedAPI.modifyFeedItemRepliesCountBy(annotationId, 1);
                feedAPI.updateReplyItem({ ...annotationReply, isPending: false }, annotationId, requestId);
            }

            this.refreshActivitySidebar();
        }

        deleteAnnotation() {
            const {
                annotatorState: { action, annotation },
                api,
                file,
            } = this.props;

            const feedAPI = api.getFeedAPI(false);
            feedAPI.file = file;

            if (action === 'delete_start') {
                feedAPI.updateFeedItem({ isPending: true }, annotation.id);
            } else {
                feedAPI.deleteFeedItem(annotation.id);
            }

            this.refreshActivitySidebar();
        }

        deleteAnnotationReply() {
            const {
                annotatorState: {
                    action,
                    annotation: { id: annotationId },
                    annotationReply: { id: replyId },
                },
                api,
                file,
            } = this.props;

            const feedAPI = api.getFeedAPI(false);
            feedAPI.file = file;

            if (action === 'reply_delete_start') {
                feedAPI.updateReplyItem({ isPending: true }, annotationId, replyId);
            } else {
                const { items: feedItems = [] } = feedAPI.getCachedItems(file.id) || {};
                const annotationItem = feedItems.find(({ id }) => id === annotationId);

                if (!annotationItem) {
                    return;
                }

                // Check if the parent annotation has the reply currently visible and if so, remove it
                const replyItem = annotationItem.replies.find(({ id }) => id === replyId);
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
                annotatorState: { action, annotation },
                api,
                file,
            } = this.props;

            const feedAPI = api.getFeedAPI(false);
            const isPending = action === 'update_start';
            feedAPI.file = file;

            feedAPI.updateFeedItem({ ...annotation, isPending }, annotation.id);

            this.refreshActivitySidebar();
        }

        updateAnnotationReply() {
            const {
                annotatorState: { action, annotation, annotationReply },
                api,
                file,
            } = this.props;

            const feedAPI = api.getFeedAPI(false);
            const isPending = action === 'reply_update_start';
            feedAPI.file = file;

            feedAPI.updateReplyItem({ ...annotationReply, isPending }, annotation.id, annotationReply.id);

            this.refreshActivitySidebar();
        }

        updateActiveAnnotation = () => {
            const {
                annotatorState: { activeAnnotationFileVersionId, activeAnnotationId },
                file,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                location,
            } = this.props;
            const match = getAnnotationsMatchPath(location);
            const currentFileVersionId = getProp(file, 'file_version.id');
            const defaultFileVersionId = activeAnnotationFileVersionId || currentFileVersionId;
            const fileVersionId = getProp(match, 'params.fileVersionId', defaultFileVersionId);
            const newLocationState = activeAnnotationId ? { open: true } : location.state;

            // Update the location pathname and open state if transitioning to an active annotation id, force the sidebar open
            history.push({
                pathname: getAnnotationsPath(fileVersionId, activeAnnotationId),
                state: newLocationState,
            });
        };

        updateActiveVersion = () => {
            const {
                api,
                file,
                fileId,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                history,
                location,
                onVersionChange,
            } = this.props;
            const feedAPI = api.getFeedAPI(false);
            const match = getAnnotationsMatchPath(location);
            const currentFileVersionId = getProp(file, 'file_version.id');
            const fileVersionId = getProp(match, 'params.fileVersionId');
            const { items: feedItems = [] } = feedAPI.getCachedItems(fileId) || {};
            const version = feedItems
                .filter(item => item.type === FEED_ITEM_TYPE_VERSION)
                .find(item => item.id === fileVersionId);

            if (version) {
                onVersionChange(version, {
                    currentVersionId: currentFileVersionId,
                    updateVersionToCurrent: () => history.push(getAnnotationsPath(currentFileVersionId)),
                });
            }
        };

        refreshActivitySidebar = () => {
            const { isOpen, location } = this.props;

            const pathname = getProp(location, 'pathname', '');
            const isActivity = matchPath(pathname, '/activity');
            const { current } = this.sidebarPanels;

            // If the activity sidebar is currently open, then force it to refresh with the updated data
            if (current && isActivity && isOpen) {
                current.refresh(false);
            }
        };

        render() {
            return <WrappedComponent ref={this.sidebarPanels} {...this.props} />;
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithSidebarAnnotations.displayName = `WithSidebarAnnotations(${displayName})`;

    return WithSidebarAnnotations;
}
