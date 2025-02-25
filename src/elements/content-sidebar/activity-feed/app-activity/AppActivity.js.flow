/**
 * @flow
 * @file AppActivity component
 */

import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import TetherComponent from 'react-tether';
import { FormattedMessage, injectIntl } from 'react-intl';

import ActivityCard from '../ActivityCard';
import ActivityTimestamp from '../common/activity-timestamp';
import DeleteConfirmation from '../common/delete-confirmation';
import IconTrash from '../../../../icons/general/IconTrash';
import Media from '../../../../components/media';
import messages from './messages';
import { bdlGray80 } from '../../../../styles/variables';
import { Link } from '../../../../components/link';
import { MenuItem } from '../../../../components/menu';
import type { AppItem, ActivityTemplateItem, ActionItemError } from '../../../../common/types/feed';
import type { User, BoxItemPermission } from '../../../../common/types/core';
import './AppActivity.scss';

type Props = {
    activity_template: ActivityTemplateItem,
    app: AppItem,
    created_at: string,
    created_by: User,
    currentUser?: User,
    error?: ActionItemError,
    id: string,
    intl: any,
    isPending?: boolean,
    onDelete: ({ id: string, permissions?: {} }) => void,
    permissions?: BoxItemPermission,
    rendered_text: string,
};

type State = {
    isConfirmingDelete: boolean,
};

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
                    className="bcs-AppActivity-link"
                    target="_blank"
                >
                    {textContent}
                </Link>
            );
        default:
            return textContent;
    }
}

class AppActivity extends React.PureComponent<Props, State> {
    static defaultProps = {
        onDelete: noop,
        permissions: {},
    };

    parser = new DOMParser();

    state: State = {
        isConfirmingDelete: false,
    };

    handleDeleteCancel = (): void => {
        this.setState({ isConfirmingDelete: false });
    };

    handleDeleteClick = () => {
        this.setState({ isConfirmingDelete: true });
    };

    handleDeleteConfirm = (): void => {
        const { id, onDelete, permissions } = this.props;

        onDelete({ id, permissions });
    };

    parseActivity = (): Array<HTMLLinkElement> => {
        const { rendered_text: renderedText } = this.props;
        const doc: Document = this.parser.parseFromString(renderedText, 'text/html');
        if (!doc) {
            return [];
        }

        const childNodes = getProp(doc, 'body.childNodes', []);
        return Array.from(childNodes);
    };

    render() {
        const {
            activity_template: { id: templateId },
            app: { name, icon_url },
            created_at: createdAt,
            created_by: createdBy,
            currentUser,
            error,
            intl,
            isPending,
            permissions,
        } = this.props;

        const canDelete = getProp(permissions, 'can_delete', false) || (currentUser && currentUser.id === createdBy.id);
        const createdAtTimestamp = new Date(createdAt).getTime();
        const isMenuVisible = canDelete && !isPending;
        const { isConfirmingDelete } = this.state;

        return (
            <ActivityCard
                className="bcs-AppActivity"
                data-resin-target="loaded"
                data-resin-feature={`appActivityCard${templateId}`}
            >
                <Media
                    className={classNames({
                        'bcs-is-pending': isPending || error,
                    })}
                >
                    <Media.Figure>
                        <img
                            className="bcs-AppActivity-icon"
                            alt={intl.formatMessage(messages.appActivityAltIcon, { appActivityName: name })}
                            src={icon_url}
                        />
                    </Media.Figure>

                    <Media.Body className="bcs-AppActivity-body">
                        {isMenuVisible && (
                            <TetherComponent
                                attachment="top right"
                                className="bcs-AppActivity-confirm"
                                constraints={[{ to: 'scrollParent', attachment: 'together' }]}
                                targetAttachment="bottom right"
                            >
                                <Media.Menu isDisabled={isConfirmingDelete}>
                                    <MenuItem onClick={this.handleDeleteClick}>
                                        <IconTrash color={bdlGray80} />
                                        <FormattedMessage {...messages.appActivityDeleteMenuItem} />
                                    </MenuItem>
                                </Media.Menu>

                                {isConfirmingDelete && (
                                    <DeleteConfirmation
                                        isOpen={isConfirmingDelete}
                                        message={messages.appActivityDeletePrompt}
                                        onDeleteCancel={this.handleDeleteCancel}
                                        onDeleteConfirm={this.handleDeleteConfirm}
                                    />
                                )}
                            </TetherComponent>
                        )}

                        <figcaption className="bcs-AppActivity-headline">{name}</figcaption>

                        <div>
                            <ActivityTimestamp date={createdAtTimestamp} />
                        </div>

                        {this.parseActivity().map(mapActivityNodes)}
                    </Media.Body>
                </Media>
            </ActivityCard>
        );
    }
}

export default injectIntl(AppActivity);
