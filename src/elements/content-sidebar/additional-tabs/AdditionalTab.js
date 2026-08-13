/**
 * @flow
 * @file Sidebar Additional Tab component
 * @author Box
 */

import * as React from 'react';
import camelCase from 'lodash/camelCase';
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

const TARGET_ID_PREFIX = 'AdditionalTab';

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

    /**
     * Analytics target id for this tab.
     *
     * Consumers may set targetId explicitly; otherwise it is derived from the integration's
     * backend serviceName ("Adobe Sign" -> AdditionalTab-adobeSign) so each app in the rail is
     * distinguishable. The overflow tab has no service of its own, and a tab whose serviceName
     * is missing falls back to a shared id rather than an unusable one.
     *
     * @return {string} the data-target-id value
     */
    getTargetId(isOverflow: boolean) {
        const { serviceName, targetId } = this.props;

        if (targetId) {
            return targetId;
        }

        if (isOverflow) {
            return `${TARGET_ID_PREFIX}-moreButton`;
        }

        const slug = camelCase(serviceName || '');

        return slug ? `${TARGET_ID_PREFIX}-${slug}` : `${TARGET_ID_PREFIX}-integrationButton`;
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
            // Analytics-only; excluded so it does not reach consumers through callbackData.
            // Note serviceName is deliberately left in rest, since consumers read it from there.
            targetId: unusedTargetId,
            ...rest
        } = this.props;

        const isDisabled = this.isDisabled();
        const isOverflow = !!id && id < 0;

        const className = classNames('bdl-AdditionalTab', {
            'bdl-is-hidden': isLoading,
            'bdl-is-disabled': isDisabled,
            'bdl-is-overflow': isOverflow,
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
                    data-target-id={this.getTargetId(isOverflow)}
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
