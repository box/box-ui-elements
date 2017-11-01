/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
import { Button, PrimaryButton, PlainButton } from '../Button';
import './Footer.scss';

type Props = {
    selectedCount: number,
    onSelectedClick: Function,
    hasHitSelectionLimit: boolean,
    onChoose: Function,
    onCancel: Function,
    chooseButtonLabel?: string,
    cancelButtonLabel?: string
};

const Footer = ({
    selectedCount,
    onSelectedClick,
    hasHitSelectionLimit,
    onCancel,
    onChoose,
    chooseButtonLabel,
    cancelButtonLabel
}: Props) =>
    <div className='bcp-footer'>
        <div className='bcp-footer-left'>
            <PlainButton onClick={onSelectedClick}>
                <span className='bcp-selected-count'>{selectedCount}</span>
                &nbsp;
                <FormattedMessage {...messages.selected} />
            </PlainButton>
            &nbsp;
            {hasHitSelectionLimit
                ? <span className='bcp-selected-max'>
                    <FormattedMessage {...messages.max} />
                </span>
                : null}
        </div>
        <div className='bcp-footer-right'>
            <Button onClick={onCancel}>
                {cancelButtonLabel || <FormattedMessage {...messages.cancel} />}
            </Button>
            <PrimaryButton onClick={onChoose}>
                {chooseButtonLabel || <FormattedMessage {...messages.choose} />}
            </PrimaryButton>
        </div>
    </div>;

export default Footer;
