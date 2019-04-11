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
import { haze } from '../../../styles/variables';
import FileInfo from './FileInfo';
import './Header.scss';

type Props = {
    file?: BoxItem,
    onClose?: Function,
} & InjectIntlProvidedProps;

const VersionsHeader = ({ file, intl, onClose }: Props) => {
    const closeMsg = intl.formatMessage(messages.close);

    return (
        <React.Fragment>
            {file && <FileInfo file={file} />}
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
