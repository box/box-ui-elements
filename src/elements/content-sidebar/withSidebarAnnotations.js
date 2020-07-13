// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { matchPath, type ContextRouter } from 'react-router-dom';
import { getBadUserError } from '../../utils/error';
import type { WithAnnotatorContextProps } from '../common/annotator-context';
import type { BoxItem, User } from '../../common/types/core';

type Props = {
    ...ContextRouter,
    currentUser?: User,
    file: BoxItem,
    fileId: string,
    isOpen: boolean,
    onVersionChange: Function,
} & WithAnnotatorContextProps;

type SidebarPanelsRefType = {
    refresh: (shouldRefreshCache?: boolean) => void,
};

export default function withSidebarAnnotations(
    WrappedComponent: React.ComponentType<Props>,
): React.ComponentType<Props> {
    class WithSidebarAnnotations extends React.Component<Props> {
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
            const { activeAnnotationId, annotation } = annotatorState;
            const { activeAnnotationId: prevActiveAnnotationId, annotation: prevAnnotation } = prevAnnotatorState;

            const match = getAnnotationsMatchPath(location);
            const prevMatch = getAnnotationsMatchPath(prevLocation);
            const fileVersionId = getProp(match, 'params.fileVersionId');
            const hasActiveAnnotationChanged = prevActiveAnnotationId !== activeAnnotationId;
            const isAnnotationsPath = !!match;
            const isTransitioningToAnnotationPath = activeAnnotationId && !isAnnotationsPath;
            const prevFileVersionId = getProp(prevMatch, 'params.fileVersionId');

            if (annotation && prevAnnotation !== annotation) {
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
                isOpen,
                location,
            } = this.props;

            if (!requestId) {
                return;
            }

            // TODO: need to address in follow on -- currentUser may be undefined here but is never fetched for sure until ActivitySidebar
            if (!currentUser) {
                throw getBadUserError();
            }

            const feedAPI = api.getFeedAPI(false);
            const pathname = getProp(location, 'pathname', '');
            const isActivity = matchPath(pathname, '/activity');
            const isPending = action === 'create_start';
            const { items: hasItems } = feedAPI.getCachedItems(fileId) || {};
            const { current } = this.sidebarPanels;

            // If there are existing items in the cache for this file, then patch the cache with the new annotation
            // If there are no cache entry for feeditems, then it is assumed that it has not yet been fetched.
            if (hasItems) {
                feedAPI.addAnnotation(file, currentUser, annotation, requestId, isPending);
            }

            // If the activity sidebar is currently open, then force it to refresh with the updated data
            if (current && isActivity && isOpen) {
                current.refresh(false);
            }
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
                .filter(item => item.type === 'file_version')
                .find(item => item.id === fileVersionId);

            if (version) {
                onVersionChange(version, {
                    currentVersionId: currentFileVersionId,
                    updateVersionToCurrent: () => history.push(getAnnotationsPath(currentFileVersionId)),
                });
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
