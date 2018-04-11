/**
 * @flow
 * @file CommentInlineError component used by Comment component.
 */
import React from 'react';
import type { Node } from 'react';

import InlineError from 'box-react-ui/lib/components/inline-error';
import PlainButton from 'box-react-ui/lib/components/plain-button';

type Props = {
    action: {
        onAction: Function,
        text: string
    },
    message: string,
    title: string
};

const CommentInlineError = ({ action, message, title }: Props): Node => (
    <InlineError className='bcs-comment-error' title={title}>
        <div>{message}</div>
        {action ? (
            <PlainButton className='lnk bcs-comment-error-action' onClick={action.onAction} type='button'>
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

export default CommentInlineError;
