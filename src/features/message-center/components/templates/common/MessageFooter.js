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
    name: string,
|};

const renderActionItem = (actionItem: ?ButtonParam, name: string) => {
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
                data-resin-target={`messageCenterAction|${name}`}
                href={openURLAction.url}
                target={openURLAction.target}
            >
                {label} &rarr;
            </a>
        );
    }
    return null;
};

function MessageFooter({ actionItem, className = '', date, name }: Props) {
    return (
        <div className={classNames('MessageFooter', className)}>
            <span className="MessageFooter-date">
                <MessageFormattedDate date={date} />
            </span>
            {renderActionItem(actionItem, name)}
        </div>
    );
}

export default MessageFooter;
