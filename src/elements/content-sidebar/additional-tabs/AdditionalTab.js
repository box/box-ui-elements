/**
 * @flow
 * @file Sidebar Additional Tab component
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import Tooltip from '../../common/Tooltip';
import PlainButton from '../../../components/plain-button/PlainButton';
import IconEllipsis from '../../../icons/general/IconEllipsis';

import './AdditionalTab.scss';

type Props = {
    isLoading: boolean,
    onImageLoad: () => void,
} & AdditionalSidebarTab;

const AdditionalTab = ({ callback: callbackFn = noop, iconUrl, id, isLoading, onImageLoad, title, ...rest }: Props) => {
    const className = classNames('bcs-nav-btn', { 'bdl-AdditionalTab--hidden': isLoading });

    return (
        <Tooltip position="middle-left" text={title}>
            <PlainButton className={className} type="button" onClick={() => callbackFn({ id, callbackData: rest })}>
                {id && id > 0 && iconUrl ? (
                    <img className="bdl-AdditionalTab-icon" src={iconUrl} onLoad={onImageLoad} alt={title} />
                ) : (
                    <IconEllipsis className="bdl-AdditionalTab-moreIcon" />
                )}
            </PlainButton>
        </Tooltip>
    );
};

export default AdditionalTab;
