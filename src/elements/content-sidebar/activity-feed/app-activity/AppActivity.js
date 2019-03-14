/**
 * @flow
 * @file AppActivity component
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';

import InlineDelete from '../inline-delete';
import { ReadableTime } from '../../../../components/time';
import Tooltip from '../../../../components/tooltip';
import { Link } from '../../../../components/link';
import messages from '../../../common/messages';
import { ONE_HOUR_MS } from '../../../../constants';

import './AppActivity.scss';

const parser = new DOMParser();

type Props = {
    activity_template: ActivityTemplateItem,
    app: AppItem,
    created_at: string,
    created_by: User,
    currentUser: User,
    error?: ActionItemError,
    id: string,
    intl: IntlShape,
    isPending: boolean,
    onDelete: Function,
    permissions?: BoxItemPermission,
    rendered_text: string,
};

function parseActivity(htmlString: string): Array<HTMLLinkElement> {
    const doc: Document = parser.parseFromString(htmlString, 'text/html');
    if (!doc) {
        return [];
    }

    const childNodes = getProp(doc, 'body.childNodes', []);
    return Array.from(childNodes);
}

function mapActivityNodes(node: HTMLLinkElement): React.Node {
    const { dataset = {}, href = '#', tagName, textContent } = node;
    switch (tagName) {
        case 'A':
            return (
                <Link
                    href={href}
                    data-resin-target={dataset.resinTarget}
                    data-resin-action={dataset.resinAction}
                    key={`app_actvity_link_${href}`}
                    rel="roreferrer noopener"
                    className="bcs-app-activity-link"
                    target="_blank"
                >
                    {textContent}
                </Link>
            );
        default:
            return textContent;
    }
}

const AppActivity = ({
    activity_template,
    app,
    currentUser,
    created_at,
    created_by,
    error,
    id,
    intl,
    isPending,
    rendered_text,
    permissions = {},
    onDelete = noop,
}: Props): React.Node => {
    const createdAtTimestamp = new Date(created_at).getTime();
    const activityNodes = parseActivity(rendered_text);
    const canDelete = getProp(permissions, 'can_delete', false) || currentUser.id === created_by.id;
    const { name, icon_url } = app;
    const { id: templateId } = activity_template;

    return (
        <div
            className="bcs-app-activity-container"
            data-resin-target="loaded"
            data-resin-feature={`app_activity_${templateId}_card`}
        >
            <div
                className={classNames('bcs-app-activity', {
                    'bcs-is-pending': isPending || error,
                })}
            >
                <img
                    className="bcs-app-activity-icon"
                    alt={intl.formatMessage(messages.appActivityAltIcon, { appActivityName: name })}
                    src={icon_url}
                />
                <div className="bcs-app-activity-content">
                    <div className="bcs-app-activity-headline">
                        <span className="bcs-app-activity-app-name">{name}</span>
                        {canDelete && !isPending && (
                            <InlineDelete
                                id={id}
                                permissions={permissions}
                                message={<FormattedMessage {...messages.appActivityDeletePrompt} />}
                                onDelete={onDelete}
                            />
                        )}
                    </div>
                    <div>
                        <Tooltip
                            text={
                                <FormattedMessage
                                    {...messages.appActivityCreatedAtFullDateTime}
                                    values={{ time: createdAtTimestamp }}
                                />
                            }
                        >
                            <small className="bcs-app-activity-created-at">
                                <ReadableTime timestamp={createdAtTimestamp} relativeThreshold={ONE_HOUR_MS} />
                            </small>
                        </Tooltip>
                    </div>
                    {activityNodes.map(mapActivityNodes)}
                </div>
            </div>
        </div>
    );
};

export default injectIntl(AppActivity);
