/**
 * @flow
 * @file Preview versions header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from '../../../components/plain-button/PlainButton';
import IconClose from '../../../icons/general/IconClose';
import messages from '../../../common/messages';
import { getIcon } from '../../common/item/iconCellRenderer';
import { haze } from '../../../styles/variables';
import './Header.scss';

type Props = {
    file?: BoxItem,
    onClose?: Function,
} & InjectIntlProvidedProps;

const VersionsHeader = ({ file, intl, onClose }: Props) => {
    const name = file ? file.name : '';
    const closeMsg = intl.formatMessage(messages.close);

    return (
        <React.Fragment>
            <div className="bcpr-name">
                {file ? getIcon(24, file) : null}
                <span>{name}</span>
            </div>
            <div className="bcpr-btns">
                {onClose && (
                    <PlainButton
                        aria-label={closeMsg}
                        className="bcpr-btn"
                        onClick={onClose}
                        title={closeMsg}
                        type="button"
                    >
                        <IconClose color={haze} height={24} width={24} />
                    </PlainButton>
                )}
            </div>
        </React.Fragment>
    );
};

export default injectIntl(VersionsHeader);
