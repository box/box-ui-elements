import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
import LabelPill from '../label-pill';
import { LabelPillSize } from '../label-pill/LabelPill';
import Avatar from '../avatar';

import type { GetPillImageUrl } from './flowTypes';

import './RoundPill.scss';

export interface RoundPillProps {
    /** Additional CSS class for the pill */
    className?: string;
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: GetPillImageUrl;
    /** Whether the pill should show a warning style */
    hasWarning?: boolean;
    /** Identifier passed to getPillImageUrl and the avatar */
    id?: string | number;
    /** Whether the pill is disabled and cannot be removed */
    isDisabled?: boolean;
    /** Whether the avatar should be labeled as external */
    isExternal?: boolean;
    /** Whether the pill is currently selected */
    isSelected?: boolean;
    /** Whether the pill value is valid */
    isValid?: boolean;
    /** Called when the remove control is clicked */
    onRemove: () => void;
    /** Whether to show an avatar in the pill */
    showAvatar?: boolean;
    /** Display text for the pill */
    text: string;
    /** Optional type passed to getPillImageUrl */
    type?: string | null;
}

interface RoundPillState {
    avatarUrl?: string | null;
}

const RemoveButton = ({ onClick, ...rest }: { onClick: () => void } & Record<string, unknown>) => (
    // X's SVGProps omit onClick; LabelPill.Icon forwards the handler at runtime
    <X {...({ ...rest, onClick, 'aria-hidden': 'true' } as React.ComponentProps<typeof X>)} />
);

class RoundPill extends React.PureComponent<RoundPillProps, RoundPillState> {
    static defaultProps = {
        isDisabled: false,
        isSelected: false,
        isValid: true,
        hasWarning: false,
        showAvatar: false,
    };

    state: RoundPillState = {
        avatarUrl: undefined,
    };

    isMounted: boolean = false;

    getStyles = (): string => {
        const { className, isSelected, isDisabled, hasWarning, isValid } = this.props;

        return classNames('bdl-RoundPill', className, {
            'bdl-RoundPill--selected': isSelected && !isDisabled,
            'bdl-RoundPill--disabled': isDisabled,
            'bdl-RoundPill--warning': hasWarning,
            'bdl-RoundPill--error': !isValid,
        });
    };

    handleClickRemove = () => {
        const { isDisabled, onRemove } = this.props;
        return isDisabled ? noop : onRemove();
    };

    /**
     * Success handler for getting avatar url
     *
     * @param {string} [avatarUrl] the user avatar url
     */
    getAvatarUrlHandler = (avatarUrl?: string | null) => {
        if (this.isMounted) {
            this.setState({
                avatarUrl,
            });
        }
    };

    /**
     * Gets the avatar URL for the user from the getPillImageUrl prop
     *
     * @return {void}
     */
    getAvatarUrl() {
        const { getPillImageUrl, id, type } = this.props;
        Promise.resolve(getPillImageUrl && id ? getPillImageUrl({ id, type }) : undefined)
            .then(this.getAvatarUrlHandler)
            .catch(() => {
                // noop
            });
    }

    componentDidMount() {
        this.isMounted = true;
        this.getAvatarUrl();
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    render() {
        const { id, isExternal, showAvatar, text } = this.props;
        const { avatarUrl } = this.state;
        const LabelPillIcon = LabelPill.Icon as unknown as React.ComponentType<Record<string, unknown>>;

        return (
            <LabelPill.Pill size={LabelPillSize.LARGE} className={this.getStyles()}>
                {showAvatar ? (
                    <LabelPillIcon
                        Component={Avatar}
                        className="bdl-RoundPill-avatar"
                        avatarUrl={avatarUrl}
                        id={id}
                        isExternal={isExternal}
                        name={text}
                        size="small"
                        shouldShowExternal
                    />
                ) : null}
                <LabelPill.Text className="bdl-RoundPill-text">{text}</LabelPill.Text>
                <LabelPillIcon
                    className="bdl-RoundPill-closeBtn"
                    Component={RemoveButton}
                    onClick={this.handleClickRemove}
                />
            </LabelPill.Pill>
        );
    }
}

export default RoundPill;
