// @flow
import * as React from 'react';
import classNames from 'classnames';
import type { ButtonParam } from '../../../types';
import './styles/MessageFooter.scss';
import MessageFormattedDate from './MessageFormattedDate';

type Props = {|
    actionItem?: ButtonParam,
    className?: string,
    date: Date,
|};

const renderActionItem = (actionItem: ?ButtonParam) => {
    if (!actionItem) {
        return null;
    }

    const { label, actions } = actionItem;

    const openURLAction = actions.find(action => {
        return action.type === 'openURL';
    });

    if (openURLAction && openURLAction.url && openURLAction.target) {
        return (
            <a
                className="MessageFooter-action"
                data-resin-target="messageCenterAction"
                href={openURLAction.url}
                target={openURLAction.target}
            >
                {label} &rarr;
            </a>
        );
    }
    return null;
};

function MessageFooter({ actionItem, className = '', date }: Props) {
    return (
        <div className={classNames('MessageFooter', className)}>
            <span className="MessageFooter-date">
                <MessageFormattedDate date={date} />
            </span>
            {renderActionItem(actionItem)}
        </div>
    );
}

export default MessageFooter;
