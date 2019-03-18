/**
 * @flow
 * @file Sidebar Additional Tab component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import Tooltip from '../../common/Tooltip';
import PlainButton from '../../../components/plain-button/PlainButton';
import IconEllipsis from '../../../icons/general/IconEllipsis';
import AdditionalTabPlaceholder from './AdditionalTabPlaceholder';

import './AdditionalTab.scss';

type Props = {
    isLoading: boolean,
    onImageLoad: () => void,
} & AdditionalSidebarTab;

type State = {
    isErrored: boolean,
};

class AdditionalTab extends React.PureComponent<Props, State> {
    state = {
        isErrored: false,
    };

    onImageError = () => {
        this.props.onImageLoad();
        this.setState({ isErrored: true });
    };

    render() {
        const { callback: callbackFn, id, isLoading, iconUrl, onImageLoad, title, ...rest } = this.props;
        const { isErrored } = this.state;
        const className = classNames('bdl-AdditionalTab', { 'bdl-AdditionalTab--hidden': isLoading });

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
            TabIcon = <IconEllipsis className="bdl-AdditionalTab-moreIcon" />;
        }

        return (
            <Tooltip position="middle-left" text={title}>
                <PlainButton className={className} type="button" onClick={() => callbackFn({ id, callbackData: rest })}>
                    {TabIcon}
                </PlainButton>
            </Tooltip>
        );
    }
}

export default AdditionalTab;
