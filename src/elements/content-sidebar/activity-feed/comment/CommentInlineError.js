/**
 * @flow
 * @file CommentInlineError component used by Comment component.
 */

import * as React from 'react';

import { FormattedMessage } from 'react-intl';
import InlineError from '../../../../components/inline-error';
import PlainButton from '../../../../components/plain-button';

type Props = {
    action?: {
        onAction: Function,
        text: string,
    },
    message: MessageDescriptor,
    title: MessageDescriptor,
};

const CommentInlineError = ({ action, message, title }: Props): React.Node => (
    <InlineError className="bcs-comment-error" title={<FormattedMessage {...title} />}>
        <div>{<FormattedMessage {...message} />}</div>
        {action ? (
            <PlainButton className="lnk bcs-comment-error-action" onClick={action.onAction} type="button">
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

export default CommentInlineError;
