import * as React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';
import InlineError from '../../../../../components/inline-error';
import PlainButton from '../../../../../components/plain-button';
import { ButtonType } from '../../../../../components/button';
import './ActivityError.scss';

export interface ActivityErrorProps {
    action?: {
        onAction: () => void;
        text: string;
    };
    className?: string;
    message: MessageDescriptor;
    title: MessageDescriptor;
}

const ActivityError = ({ action, className, message, title, ...rest }: ActivityErrorProps): React.ReactElement => (
    <InlineError
        className={classnames('bcs-ActivityError', className)}
        title={<FormattedMessage {...title} {...rest} />}
    >
        <div>
            <FormattedMessage {...message} />
        </div>
        {action ? (
            <PlainButton className="bcs-ActivityError-action lnk" onClick={action.onAction} type={ButtonType.BUTTON}>
                {action.text}
            </PlainButton>
        ) : null}
    </InlineError>
);

export default ActivityError;
