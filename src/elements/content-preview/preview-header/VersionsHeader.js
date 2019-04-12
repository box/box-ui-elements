/**
 * @flow
 * @file Preview versions header component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import PlainButton from '../../../components/plain-button/PlainButton';
import messages from '../../common/messages';
import FileInfo from './FileInfo';
import './Header.scss';

type Props = {
    file?: BoxItem,
    onClose?: Function,
} & InjectIntlProvidedProps;

const VersionsHeader = ({ file, intl, onClose }: Props) => {
    const backMsg = intl.formatMessage(messages.back);

    return (
        <React.Fragment>
            {file && <FileInfo file={file} />}
            <div className="bcpr-btns">
                {onClose && (
                    <PlainButton
                        aria-label={backMsg}
                        className="bcpr-btn bcpr-name"
                        onClick={onClose}
                        title={backMsg}
                        type="button"
                    >
                        {backMsg}
                    </PlainButton>
                )}
            </div>
        </React.Fragment>
    );
};

export default injectIntl(VersionsHeader);
