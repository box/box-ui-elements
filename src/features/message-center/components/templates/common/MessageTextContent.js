// @flow
import * as React from 'react';
import classNames from 'classnames';
import sanitizeHTML from 'sanitize-html';
import './styles/MessageTextContent.scss';

type Props = {|
    body?: string,
    className?: string,
    title: string,
|};

function MessageTextContent({ body = '', title, className }: Props) {
    return (
        <div className={classNames('MessageTextContent', className)}>
            <div className="MessageTextContent-title">{title}</div>
            {/* eslint-disable-next-line react/no-danger */}
            <div className="MessageTextContent-body" dangerouslySetInnerHTML={{ __html: sanitizeHTML(body) }} />
        </div>
    );
}

export default MessageTextContent;
