// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import classnames from 'classnames';
import InlineError from '../../../../../components/inline-error';
import PlainButton from '../../../../../components/plain-button';
import './ActivityError.scss';

type Props = {
    action?: {
        onAction: Function,
        text: string,
    },
    className?: string,
    message: MessageDescriptor,
    title: MessageDescriptor,
};

const ActivityError = ({ action, message, title, className, ...rest }: Props): React.Node => (
    <InlineError
        className={classnames('bcs-ActivityError', className)}
        title={<FormattedMessage {...title} {...rest} />}
    >
        <div>
            <FormattedMessage {...message} />
        </div>
        {action ? (
            <PlainButton className="bcs-ActivityError-action lnk" onClick={action.onAction} type="button">
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

export default ActivityError;
