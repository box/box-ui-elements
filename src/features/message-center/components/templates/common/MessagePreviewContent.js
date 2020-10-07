// // @flow
import * as React from 'react';
import classNames from 'classnames';
import ContentPreview from '../../../../../elements/content-preview';
import type { Token } from '../../../../../common/types/core';
import Cache from '../../../../../utils/Cache';
import PreviewGhost from './PreviewGhost';
import PreviewErrorNotification from './PreviewErrorNotification';
import './styles/MessagePreviewContent.scss';

type Props = {|
    apiHost: string,
    className?: string,
    fileId: string,
    getToken: (fileId: string) => Promise<Token>,
    sharedLink: string,
|};

const apiCache = new Cache();

function MessagePreviewContent({ fileId, sharedLink, getToken, className = '', apiHost }: Props) {
    const [isPreviewLoaded, setIsPreviewLoaded] = React.useState(false);
    const [isPreviewInErrorState, setIsPreviewInErrorState] = React.useState(false);
    const previewRef = React.useRef(null);

    return (
        <div className={classNames('MessagePreviewContent', className)}>
            {isPreviewLoaded ? null : <PreviewGhost />}
            {isPreviewInErrorState ? (
                <PreviewErrorNotification />
            ) : (
                <ContentPreview
                    apiHost={apiHost}
                    cache={apiCache}
                    className={classNames({ 'MessagePreviewContent is-loading': !isPreviewLoaded })}
                    componentRef={previewRef}
                    fileId={fileId}
                    onError={() => {
                        setIsPreviewLoaded(true);
                        setIsPreviewInErrorState(true);
                    }}
                    onLoad={() => {
                        if (previewRef.current) {
                            previewRef.current.getViewer().disableViewerControls();
                            setIsPreviewLoaded(true);
                        }
                    }}
                    sharedLink={sharedLink}
                    token={() => getToken(fileId)}
                />
            )}
        </div>
    );
}

export default MessagePreviewContent;
