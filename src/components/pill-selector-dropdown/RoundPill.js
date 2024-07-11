// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import X from '../../icon/fill/X16';
// $FlowFixMe this imports from a typescript file
import LabelPill from '../label-pill';
import Avatar from '../avatar';

import './RoundPill.scss';

type Props = {
    className?: string,
    /** Function to retrieve the image URL associated with a pill */
    getPillImageUrl?: (data: { id: string | number, [key: string]: any }) => string | Promise<?string>,
    hasWarning?: boolean,
    id?: string | number,
    isDisabled?: boolean,
    isExternal?: boolean,
    isSelected?: boolean,
    isValid?: boolean,
    onRemove: () => any,
    showAvatar?: boolean,
    text: string,
    type?: string | null,
};

type State = {
    avatarUrl: ?string,
};

const RemoveButton = ({ onClick, ...rest }: { onClick: () => any }) => (
    <X {...rest} aria-hidden="true" onClick={onClick} />
);

class RoundPill extends React.PureComponent<Props, State> {
    static defaultProps = {
        isDisabled: false,
        isSelected: false,
        isValid: true,
        hasWarning: false,
        showAvatar: false,
    };

    state = {
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
    getAvatarUrlHandler = (avatarUrl: ?string) => {
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

        return (
            <LabelPill.Pill size="large" className={this.getStyles()}>
                {showAvatar ? (
                    <LabelPill.Icon
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
                <LabelPill.Icon
                    className="bdl-RoundPill-closeBtn"
                    Component={RemoveButton}
                    onClick={this.handleClickRemove}
                />
            </LabelPill.Pill>
        );
    }
}

export default RoundPill;
