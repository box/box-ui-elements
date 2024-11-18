/**
 * @flow
 * @file Sidebar Additional Tab component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Apps16 from '../../../icon/fill/Apps16';
import { bdlGray50 } from '../../../styles/variables';
import PlainButton from '../../../components/plain-button/PlainButton';
import AdditionalTabTooltip from './AdditionalTabTooltip';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import messages from './messages';
import type { AdditionalSidebarTab, AdditionalSidebarTabFtuxData } from '../flowTypes';
import './AdditionalTab.scss';

type Props = {
    ftuxTooltipData?: AdditionalSidebarTabFtuxData,
    isLoading: boolean,
    onImageLoad: () => void,
    status?: string,
} & AdditionalSidebarTab;

type State = {
    isErrored: boolean,
};

const BLOCKED_BY_SHEILD = 'BLOCKED_BY_SHIELD_ACCESS_POLICY';

class AdditionalTab extends React.PureComponent<Props, State> {
    state = {
        isErrored: false,
    };

    onImageError = () => {
        this.props.onImageLoad();
        this.setState({ isErrored: true });
    };

    isDisabled() {
        const { status } = this.props;
        return status === BLOCKED_BY_SHEILD;
    }

    getDisabledReason() {
        let reason = '';
        const { status } = this.props;
        switch (status) {
            case BLOCKED_BY_SHEILD:
                reason = <FormattedMessage {...messages.blockedByShieldAccessPolicy} />;
                break;
            default:
            // noop
        }
        return reason;
    }

    getTabIcon() {
        const { id, iconUrl, onImageLoad, title, icon } = this.props;
        const { isErrored } = this.state;

        let TabIcon;

        if (isErrored) {
            TabIcon = <AdditionalTabPlaceholder isLoading={false} />;
        } else if (id && id > 0) {
            TabIcon = (
                <img
                    className="bdl-AdditionalTab-icon"
                    src={iconUrl}
                    onError={this.onImageError}
                    onLoad={onImageLoad}
                    alt={title}
                />
            );
        } else {
            TabIcon = icon || <Apps16 color={bdlGray50} width={20} height={20} />;
        }

        return TabIcon;
    }

    render() {
        const {
            callback: callbackFn,
            id,
            isLoading,
            iconUrl,
            ftuxTooltipData,
            onImageLoad,
            title,
            ...rest
        } = this.props;

        const isDisabled = this.isDisabled();

        const className = classNames('bdl-AdditionalTab', {
            'bdl-is-hidden': isLoading,
            'bdl-is-disabled': isDisabled,
            'bdl-is-overflow': id && id < 0,
        });

        const tooltipText = isDisabled ? this.getDisabledReason() : title;

        return (
            <AdditionalTabTooltip
                defaultTooltipText={tooltipText}
                ftuxTooltipData={ftuxTooltipData}
                isFtuxVisible={!isLoading}
            >
                <PlainButton
                    aria-label={title}
                    className={className}
                    data-testid="additionaltab"
                    type="button"
                    isDisabled={isDisabled}
                    onClick={() => callbackFn({ id, callbackData: rest })}
                >
                    {this.getTabIcon()}
                </PlainButton>
            </AdditionalTabTooltip>
        );
    }
}

export default AdditionalTab;
