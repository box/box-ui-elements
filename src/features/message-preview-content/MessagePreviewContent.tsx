import * as React from 'react';
import classNames from 'classnames';
import ContentPreview from '../../elements/content-preview';
import { Token } from '../../common/types/core';
import Cache from '../../utils/Cache';
import MessagePreviewGhost from '../message-preview-ghost/MessagePreviewGhost';
import PreviewErrorNotification from './PreviewErrorNotification';
import './styles/MessagePreviewContent.scss';

type ContentPreviewProps = Omit<
    React.ComponentProps<typeof ContentPreview>,
    'apiHost' | 'cache' | 'className' | 'componentRef' | 'fileId' | 'onError' | 'onLoad' | 'sharedLink' | 'token'
>;

export interface Props {
    apiHost: string;
    className?: string;
    contentPreviewProps?: ContentPreviewProps;
    fileId: string;
    getToken: (fileId: string) => Promise<Token>;
    sharedLink: string;
}

const apiCache = new Cache();

function MessagePreviewContent({ contentPreviewProps, fileId, sharedLink, getToken, className = '', apiHost }: Props) {
    const [isPreviewLoaded, setIsPreviewLoaded] = React.useState(false);
    const [isPreviewInErrorState, setIsPreviewInErrorState] = React.useState(false);
    const previewRef = React.useRef<{ getViewer: () => { disableViewerControls: () => void } } | null>(null);

    React.useEffect(() => {
        setIsPreviewLoaded(false);
        setIsPreviewInErrorState(false);
    }, [fileId]);

    const handleLoad = React.useCallback(() => {
        if (previewRef.current) {
            previewRef.current.getViewer().disableViewerControls();
        }
        setIsPreviewLoaded(true);
    }, []);

    const handleError = React.useCallback(() => {
        setIsPreviewLoaded(true);
        setIsPreviewInErrorState(true);
    }, []);

    return (
        <div className={classNames('MessagePreviewContent', className, { 'is-loading': !isPreviewLoaded })}>
            {!isPreviewLoaded && <MessagePreviewGhost data-testid="message-preview-ghost" />}
            {isPreviewInErrorState ? (
                <PreviewErrorNotification data-testid="preview-error-notification" />
            ) : (
                <ContentPreview
                    {...contentPreviewProps}
                    apiHost={apiHost}
                    cache={apiCache}
                    className="MessagePreviewContent"
                    componentRef={previewRef}
                    data-testid="content-preview"
                    fileId={fileId}
                    onError={handleError}
                    onLoad={handleLoad}
                    sharedLink={sharedLink}
                    token={() => getToken(fileId)}
                />
            )}
        </div>
    );
}

export type { ContentPreviewProps };
export default MessagePreviewContent;
