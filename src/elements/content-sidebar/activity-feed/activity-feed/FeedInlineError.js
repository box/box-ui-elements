/**
 * @flow
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import InlineError from '../../../../components/inline-error/InlineError';

type Props = { activeFeedEntryType?: FeedItemType };

const FeedInlineError = ({ activeFeedEntryType }: Props): React.Node => {
    switch (activeFeedEntryType) {
        case 'comment':
            return (
                <InlineError title="Error">
                    <FormattedMessage {...messages.commentDelete} />
                </InlineError>
            );
        case 'task':
            return (
                <InlineError title="Error">
                    <FormattedMessage {...messages.taskDelete} />
                </InlineError>
            );
        default:
            return null;
    }
};

export default FeedInlineError;
