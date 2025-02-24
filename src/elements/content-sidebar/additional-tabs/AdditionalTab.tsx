import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import Apps16 from '../../../icon/fill/Apps16';
import { bdlGray50 } from '../../../styles/variables';
import PlainButton from '../../../components/plain-button';
import { ButtonType } from '../../../components/button';
import AdditionalTabTooltip from './AdditionalTabTooltip';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import messages from './messages';
import { AdditionalTabProps } from './types';
import './AdditionalTab.scss';

type State = {
    isErrored: boolean;
};

const BLOCKED_BY_SHEILD = 'BLOCKED_BY_SHIELD_ACCESS_POLICY';

class AdditionalTab extends React.PureComponent<AdditionalTabProps, State> {
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

    getButtonProps() {
        const { title } = this.props;
        const isDisabled = this.isDisabled();
        return {
            'aria-label': title || undefined,
            disabled: isDisabled,
            'aria-disabled': isDisabled,
        };
    }

    getDisabledReason(): React.ReactElement | string {
        const { status } = this.props;
        if (status === BLOCKED_BY_SHEILD) {
            return <FormattedMessage {...messages.blockedByShieldAccessPolicy} />;
        }
        return '';
    }

    getTabIcon() {
        const { id, iconUrl, onImageLoad, title, icon } = this.props;
        const { isErrored } = this.state;

        if (isErrored) {
            return <AdditionalTabPlaceholder isLoading={false} />;
        }

        if (id && id > 0 && iconUrl) {
            return (
                <div className="bdl-AdditionalTabPlaceholder">
                    <img
                        className="bdl-AdditionalTab-icon"
                        src={iconUrl}
                        onError={this.onImageError}
                        onLoad={onImageLoad}
                        alt={title || ''}
                    />
                </div>
            );
        }

        return (
            <div className="bdl-AdditionalTabPlaceholder">
                {icon || <Apps16 width={20} height={20} {...{ fill: bdlGray50 }} />}
            </div>
        );
    }

    render() {
        const { callback: callbackFn, id, isLoading, ftuxTooltipData, title, ...rest } = this.props;

        const isDisabled = this.isDisabled();

        const className = classNames('bdl-AdditionalTab', {
            'bdl-is-disabled': isDisabled,
            'bdl-is-overflow': id && id < 0,
        });

        const tooltipText = isDisabled ? this.getDisabledReason() : title || '';

        const tooltipWrapper = (
            <PlainButton
                className={className}
                data-testid="additionaltab"
                type={ButtonType.BUTTON}
                onClick={() => !this.isDisabled() && callbackFn({ id, callbackData: rest })}
                aria-label={title || undefined}
                isDisabled={this.isDisabled()}
            >
                {this.getTabIcon()}
            </PlainButton>
        );

        return (
            <AdditionalTabTooltip
                defaultTooltipText={tooltipText}
                ftuxTooltipData={ftuxTooltipData}
                isFtuxVisible={!isLoading}
            >
                {tooltipWrapper}
            </AdditionalTabTooltip>
        );
    }
}

export default AdditionalTab;
