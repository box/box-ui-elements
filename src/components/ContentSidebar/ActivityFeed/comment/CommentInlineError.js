/**
 * @flow
 * @file CommentInlineError component used by Comment component.
 */
import React, { ReactNode } from 'react';

import InlineError from 'box-react-ui/lib/components/inline-error';
import PlainButton from 'box-react-ui/lib/components/plain-button';

type Props = {
    action: {
        onAction: Function,
        text: ReactNode
    },
    message: ReactNode,
    title: ReactNode
};

const CommentInlineError = ({ action, message, title }: Props): ReactNode => (
    <InlineError className='box-ui-comment-error' title={title}>
        <div>{message}</div>
        {action ? (
            <PlainButton className='lnk box-ui-comment-error-action' onClick={action.onAction} type='button'>
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

export default CommentInlineError;
