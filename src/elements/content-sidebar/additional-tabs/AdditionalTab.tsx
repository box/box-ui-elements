import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Apps16 from '../../../icon/fill/Apps16';

import PlainButton from '../../../components/plain-button/PlainButton';
import AdditionalTabTooltip from './AdditionalTabTooltip';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';
import messages from '../../common/messages';
import type { AdditionalSidebarTab, AdditionalSidebarTabFtuxData } from '../flowTypes';
import './AdditionalTab.scss';

interface Props extends AdditionalSidebarTab {
    ftuxTooltipData?: AdditionalSidebarTabFtuxData;
    isLoading: boolean;
    onImageLoad: () => void;
    status?: string;
}

const BLOCKED_BY_SHIELD = 'BLOCKED_BY_SHIELD_ACCESS_POLICY';

const AdditionalTab = ({
    callback: callbackFn,
    iconUrl,
    id,
    isLoading,
    onImageLoad,
    title,
    icon,
    ftuxTooltipData,
    status,
    ...rest
}: Props): React.ReactElement => {
    const [isErrored, setIsErrored] = React.useState<boolean>(false);

    const onImageError = (): void => {
        onImageLoad();
        setIsErrored(true);
    };

    const isDisabled = (): boolean => {
        return status === BLOCKED_BY_SHIELD;
    };

    const getDisabledReason = (): React.ReactNode => {
        let reason: React.ReactNode = null;
        switch (status) {
            case BLOCKED_BY_SHIELD:
                reason = <FormattedMessage {...messages.blockedByShieldAccessPolicy} />;
                break;
            default:
            // noop
        }
        return reason;
    };

    const getTabIcon = (): React.ReactNode => {
        let TabIcon;

        if (isErrored) {
            TabIcon = <AdditionalTabPlaceholder isLoading={false} />;
        } else if (id && id > 0) {
            TabIcon = (
                <img
                    className="bdl-AdditionalTab-icon"
                    src={iconUrl}
                    onError={onImageError}
                    onLoad={onImageLoad}
                    alt={title}
                />
            );
        } else {
            TabIcon = icon || <Apps16 className="bdl-AdditionalTab-icon" />;
        }

        return TabIcon;
    };

    const disabled = isDisabled();

    const className = classNames('bdl-AdditionalTab', {
        'bdl-is-hidden': isLoading,
        'bdl-is-disabled': disabled,
        'bdl-is-overflow': id && id < 0,
    });

    const tooltipText = disabled ? getDisabledReason() : title;

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
                isDisabled={disabled}
                onClick={() => callbackFn({ id, callbackData: rest })}
            >
                {getTabIcon()}
            </PlainButton>
        </AdditionalTabTooltip>
    );
};

export default AdditionalTab;
