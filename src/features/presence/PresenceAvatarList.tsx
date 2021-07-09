import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
// @ts-ignore flow import
import PresenceAvatar from './PresenceAvatar';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
// @ts-ignore flow import
import { determineInteractionMessage } from './utils/presenceUtils';
import './PresenceAvatarList.scss';

type Collaborator = {
    avatarUrl?: string;
    id: string;
    isActive: boolean;
    interactedAt: number;
    interactionType: string;
    name: string;
    profileUrl: string;
};

type Props = {
    avatarAttributes?: React.HTMLAttributes<HTMLDivElement>;
    className?: string;
    collaborators: Array<Collaborator>;
    containerAttributes?: React.HTMLAttributes<HTMLDivElement>;
    hideTooltips?: boolean;
    maxAdditionalCollaborators?: number;
    maxDisplayedAvatars?: number;
    onAvatarMouseEnter?: (id: string) => void;
    onAvatarMouseLeave?: () => void;
} & WrappedComponentProps;

class PresenceAvatarList extends React.Component<Props> {
    static defaultProps = {
        maxAdditionalCollaborators: 99,
        maxDisplayedAvatars: 3,
        onAvatarMouseEnter: noop,
        onAvatarMouseLeave: noop,
    };

    constructor(props: Props) {
        super(props);

        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
    }

    state = {
        activeTooltip: null,
    };

    hideTooltip = (): void => {
        const { onAvatarMouseLeave } = this.props;
        this.setState({
            activeTooltip: null,
        });
        if (onAvatarMouseLeave) {
            onAvatarMouseLeave();
        }
    };

    getRelativeTime = (interactedAt: number): string => {
        const { intl } = this.props;

        if (intl.formatRelativeTime) {
            return intl.formatRelativeTime(interactedAt - Date.now());
        }
        // @ts-ignore: react-intl v2 backwards compatibility
        return intl.formatRelative(interactedAt);
    };

    renderTimestampMessage = (interactedAt: number, interactionType: string, isActive: boolean): JSX.Element | null => {
        const lastActionMessage = determineInteractionMessage(interactionType);
        const timeAgo = this.getRelativeTime(interactedAt);

        if (lastActionMessage) {
            return (
                <div>
                    <span className="bdl-PresenceAvatarList-tooltip-event">
                        {isActive ? (
                            <FormattedMessage {...messages.activeNowText} />
                        ) : (
                            <FormattedMessage
                                {...lastActionMessage}
                                values={{
                                    timeAgo,
                                }}
                            />
                        )}
                    </span>
                </div>
            );
        }
        return null;
    };

    renderAvatarTooltip = (
        name: string,
        interactedAt: number,
        interactionType: string,
        isActive: boolean,
    ): JSX.Element => (
        <div className="bdl-PresenceAvatarList-tooltip">
            <div>
                <span className="bdl-PresenceAvatarList-tooltip-name">{name}</span>
            </div>
            {this.renderTimestampMessage(interactedAt, interactionType, isActive)}
        </div>
    );

    showTooltip = (id: string): void => {
        const { onAvatarMouseEnter } = this.props;
        this.setState({
            activeTooltip: id,
        });
        if (onAvatarMouseEnter) {
            onAvatarMouseEnter(id);
        }
    };

    render() {
        const {
            avatarAttributes,
            className,
            collaborators,
            hideTooltips,
            maxAdditionalCollaborators = 99,
            maxDisplayedAvatars = 3,
            ...rest
        } = this.props;

        const { activeTooltip } = this.state;

        return (
            <div className={classNames('bdl-PresenceAvatarList', className)} {...rest}>
                {collaborators.slice(0, maxDisplayedAvatars).map(collaborator => {
                    const { id, avatarUrl, name, isActive, interactedAt, interactionType } = collaborator;
                    return (
                        <Tooltip
                            key={id}
                            isShown={!hideTooltips && activeTooltip === id}
                            position={TooltipPosition.BOTTOM_CENTER}
                            text={this.renderAvatarTooltip(name, interactedAt, interactionType, isActive)}
                        >
                            <PresenceAvatar
                                avatarUrl={avatarUrl}
                                id={id}
                                isActive={isActive}
                                name={name}
                                onBlur={this.hideTooltip}
                                onFocus={() => this.showTooltip(id)}
                                onMouseEnter={() => this.showTooltip(id)}
                                onMouseLeave={this.hideTooltip}
                                {...avatarAttributes}
                            />
                        </Tooltip>
                    );
                })}

                {collaborators.length > maxDisplayedAvatars && (
                    <div
                        className={classNames('bdl-PresenceAvatarList-count', 'avatar')}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                        tabIndex={0}
                        {...avatarAttributes}
                    >
                        {collaborators.length - maxDisplayedAvatars > maxAdditionalCollaborators
                            ? `${maxAdditionalCollaborators}+`
                            : `+${collaborators.length - maxDisplayedAvatars}`}
                    </div>
                )}
            </div>
        );
    }
}

export default injectIntl(PresenceAvatarList, { forwardRef: true });
