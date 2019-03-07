/**
 * @flow
 * @file Preview sidebar additional tab component
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
    ...AdditionalSidebarTab,
};

const AdditionalTab = ({ callback: callbackFn = noop, iconUrl, id, isLoading, onImageLoad, title, ...rest }: Props) => {
    const className = classNames('bcs-nav-btn', { 'is-hidden': isLoading });

    return (
        <Tooltip position="middle-left" text={title}>
            <PlainButton className={className} type="button" onClick={() => callbackFn({ id, callbackData: rest })}>
                {id && id > 0 && iconUrl ? (
                    <img className="bcs-additional-tab-icon" src={iconUrl} onLoad={onImageLoad} alt={title} />
                ) : (
                    <IconEllipsis className="bcs-additional-tab-more-icon" />
                )}
            </PlainButton>
        </Tooltip>
    );
};

export default AdditionalTab;
